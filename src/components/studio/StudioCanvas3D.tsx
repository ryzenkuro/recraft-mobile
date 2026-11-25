import { Edges, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { type ComponentRef, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useStudioStore } from '@/store/studioStore';
import type { Studio3DPayload, StudioComponentSpec } from '@/types/studio';
import { triggerHaptic } from '@/utils/haptics';

const CAMERA_FOV_DEG = 45;
const CAMERA_DIRECTION = new THREE.Vector3(2.2, 1.55, 2.8).normalize();
const MOBILE_BREAKPOINT_PX = 768;

function computeResponsiveFraming(width: number, height: number) {
  const aspect = Math.max(0.38, width / Math.max(1, height));
  const halfFovRad = THREE.MathUtils.degToRad(CAMERA_FOV_DEG / 2);
  const tanHalfFov = Math.tan(halfFovRad);

  const requiredWidthSpan = 3.1;
  const requiredHeightSpan = 2.5;

  const distForWidth = requiredWidthSpan / (2 * tanHalfFov * aspect);
  const distForHeight = requiredHeightSpan / (2 * tanHalfFov);
  const baseDistance = Math.max(3.8, distForWidth, distForHeight);

  return {
    baseDistance,
    target: new THREE.Vector3(0, 0, 0),
    position: CAMERA_DIRECTION.clone().multiplyScalar(baseDistance),
  };
}

interface StudioCanvas3DProps {
  payload: Studio3DPayload;
  resetSignal: number;
}

export function StudioCanvas3D({ payload, resetSignal }: StudioCanvas3DProps) {
  const selectComponent = useStudioStore((state) => state.selectComponent);

  return (
    <Canvas
      camera={{ position: [3.8, 2.6, 4.8], fov: CAMERA_FOV_DEG, near: 0.1, far: 60 }}
      dpr={[1, 2]}
      onPointerMissed={() => selectComponent(null)}
      className="h-full w-full touch-none bg-gradient-to-b from-sky-lighter via-surface to-sky-light/40"
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, -3]} intensity={0.45} />

      <StudioSceneContent payload={payload} resetSignal={resetSignal} />
    </Canvas>
  );
}

function StudioSceneContent({ payload, resetSignal }: StudioCanvas3DProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const stageScaleGroupRef = useRef<THREE.Group>(null);
  const isApplyingCameraRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const lastResetSignalRef = useRef(0);
  const lastCameraDistanceRef = useRef<number | null>(null);
  const currentShiftPxRef = useRef(0);

  const { camera, size } = useThree();
  const framing = useMemo(
    () => computeResponsiveFraming(size.width, size.height),
    [size.width, size.height]
  );

  const explodeFactor = useStudioStore((state) => state.explodeFactor);
  const selectedComponentCode = useStudioStore(
    (state) => state.selectedComponentCode
  );
  const sheetSnap = useStudioStore((state) => state.sheetSnap);
  const setZoomAndExplode = useStudioStore((state) => state.setZoomAndExplode);
  const selectComponent = useStudioStore((state) => state.selectComponent);

  const isMobileViewport = size.width < MOBILE_BREAKPOINT_PX;

  // Hitung target pergeseran vertikal (px) agar objek 3D selalu berada di area bersih di atas Bottom Sheet
  const targetShiftPx = useMemo(() => {
    if (!isMobileViewport) return 0;
    const topBarReservePx = 64;
    const sheetHeightPx = size.height * sheetSnap;
    const visibleHeightPx = Math.max(80, size.height - sheetHeightPx - topBarReservePx);
    const desiredCenterY = topBarReservePx + visibleHeightPx / 2;
    return Math.max(0, size.height / 2 - desiredCenterY);
  }, [isMobileViewport, size.height, sheetSnap]);

  // Skala adaptif supaya saat sheet naik atau komponen pecah (explode) tetap muat penuh tanpa terpotong
  const targetStageScale = useMemo(() => {
    const explodeShrink = 1 - explodeFactor * 0.2;
    if (!isMobileViewport) return explodeShrink;
    const sheetShrink = sheetSnap >= 0.8 ? 0.56 : sheetSnap >= 0.5 ? 0.78 : 1.0;
    return sheetShrink * explodeShrink;
  }, [isMobileViewport, sheetSnap, explodeFactor]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const shouldApply =
      !hasInitializedRef.current || resetSignal !== lastResetSignalRef.current;
    if (!shouldApply) return;

    hasInitializedRef.current = true;
    lastResetSignalRef.current = resetSignal;
    lastCameraDistanceRef.current = framing.baseDistance;
    isApplyingCameraRef.current = true;
    controls.object.position.copy(framing.position);
    controls.target.copy(framing.target);
    controls.update();

    const timer = setTimeout(() => {
      isApplyingCameraRef.current = false;
    }, 60);
    return () => clearTimeout(timer);
  }, [framing, resetSignal]);

  useEffect(() => {
    return () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.clearViewOffset();
        camera.updateProjectionMatrix();
      }
    };
  }, [camera]);

  useFrame((_, delta) => {
    // 1. Lerp pergeseran frustum kamera agar benda naik/turun mulus seiring Bottom Sheet
    if (camera instanceof THREE.PerspectiveCamera) {
      const nextShift = THREE.MathUtils.lerp(
        currentShiftPxRef.current,
        targetShiftPx,
        Math.min(1, delta * 10)
      );
      if (Math.abs(nextShift - currentShiftPxRef.current) > 0.25) {
        currentShiftPxRef.current = nextShift;
        if (nextShift > 0.5) {
          camera.setViewOffset(
            size.width,
            size.height,
            0,
            nextShift,
            size.width,
            size.height
          );
        } else {
          camera.clearViewOffset();
        }
        camera.updateProjectionMatrix();
      }
    }

    // 2. Lerp skala stage agar hasil explode & sheet 50%/80% tidak kepotong tepi layar
    if (stageScaleGroupRef.current) {
      const s = THREE.MathUtils.lerp(
        stageScaleGroupRef.current.scale.x,
        targetStageScale,
        Math.min(1, delta * 9)
      );
      stageScaleGroupRef.current.scale.setScalar(s);
    }
  });

  const handleControlsChange = () => {
    if (isApplyingCameraRef.current) return;
    const controls = controlsRef.current;
    if (!controls) return;

    const distance = controls.object.position.distanceTo(controls.target);
    if (distance <= 0.01) return;

    if (
      lastCameraDistanceRef.current !== null &&
      Math.abs(distance - lastCameraDistanceRef.current) < 0.02
    ) {
      return;
    }

    lastCameraDistanceRef.current = distance;
    setZoomAndExplode(framing.baseDistance / distance);
  };

  const handleSelectNode = (code: string) => {
    void triggerHaptic('LIGHT');
    selectComponent(selectedComponentCode === code ? null : code);
  };

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={framing.baseDistance * 0.28}
        maxDistance={framing.baseDistance * 1.8}
        onChange={handleControlsChange}
      />

      <group ref={stageScaleGroupRef}>
        <gridHelper args={[6, 12, '#CBD5E1', '#E2E8F0']} position={[0, -0.7, 0]} />

        {payload.glbUrl ? (
          <GlbAssemblyLayer
            glbUrl={payload.glbUrl}
            components={payload.components}
            explodeFactor={explodeFactor}
            selectedCode={selectedComponentCode}
            onSelect={handleSelectNode}
          />
        ) : (
          <group>
            {payload.components.map((comp) => (
              <ProceduralExplodableNode
                key={comp.code}
                spec={comp}
                explodeFactor={explodeFactor}
                selectedCode={selectedComponentCode}
                onSelect={handleSelectNode}
              />
            ))}
          </group>
        )}
      </group>
    </>
  );
}

interface NodeProps {
  spec: StudioComponentSpec;
  explodeFactor: number;
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

function ProceduralExplodableNode({
  spec,
  explodeFactor,
  selectedCode,
  onSelect,
}: NodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  const isSelected = selectedCode === spec.code;
  const isDimmed = selectedCode !== null && !isSelected;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    targetPos.set(
      spec.meshPosition[0] + spec.explodeVector[0] * explodeFactor,
      spec.meshPosition[1] + spec.explodeVector[1] * explodeFactor,
      spec.meshPosition[2] + spec.explodeVector[2] * explodeFactor
    );
    groupRef.current.position.lerp(targetPos, Math.min(1, delta * 9));
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(spec.code);
  };

  return (
    <group ref={groupRef} position={spec.meshPosition}>
      <mesh onClick={handleClick}>
        <boxGeometry args={spec.meshSize} />
        <meshStandardMaterial
          color={isSelected ? '#3B9FD9' : spec.colorHex}
          emissive={isSelected ? '#3B9FD9' : '#000000'}
          emissiveIntensity={isSelected ? 0.35 : 0}
          transparent={isDimmed}
          opacity={isDimmed ? 0.35 : 1}
          roughness={0.75}
        />
        <Edges
          scale={1.002}
          color={isSelected ? '#0F3A7D' : '#64748B'}
          threshold={15}
        />
      </mesh>

      {(explodeFactor > 0.12 || isSelected) && (
        <Html center distanceFactor={6} zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(spec.code);
            }}
            className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold shadow-soft transition-transform active:scale-95 ${
              isSelected
                ? 'bg-sky text-white ring-2 ring-white'
                : 'bg-navy/90 text-white'
            }`}
          >
            {spec.code}
          </button>
        </Html>
      )}
    </group>
  );
}

interface GlbLayerProps {
  glbUrl: string;
  components: StudioComponentSpec[];
  explodeFactor: number;
  selectedCode: string | null;
  onSelect: (code: string) => void;
}

function GlbAssemblyLayer({
  glbUrl,
  components,
  explodeFactor,
  selectedCode,
  onSelect,
}: GlbLayerProps) {
  const gltf = useGLTF(glbUrl);
  const groupRef = useRef<THREE.Group>(null);
  const specByCode = useMemo(
    () => new Map(components.map((c) => [c.code, c])),
    [components]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      const spec = specByCode.get(child.name);
      if (!spec) return;
      const target = new THREE.Vector3(
        spec.explodeVector[0] * explodeFactor,
        spec.explodeVector[1] * explodeFactor,
        spec.explodeVector[2] * explodeFactor
      );
      child.position.lerp(target, Math.min(1, delta * 9));

      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        const isSelected = selectedCode === spec.code;
        const isDimmed = selectedCode !== null && !isSelected;
        child.material.emissive.set(isSelected ? '#3B9FD9' : '#000000');
        child.material.emissiveIntensity = isSelected ? 0.35 : 0;
        child.material.transparent = isDimmed;
        child.material.opacity = isDimmed ? 0.35 : 1;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          const code = event.object.name;
          if (specByCode.has(code)) {
            onSelect(code);
          }
        }}
      />
    </group>
  );
}
