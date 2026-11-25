import { useEffect, useState } from 'react';
import { scanService } from '@/services/scanService';

interface LoadingOverlayProps {
  isVisible: boolean;
  steps?: readonly string[];
  subtitle?: string;
}

export function LoadingOverlay({
  isVisible,
  steps,
  subtitle = 'Arsitek digital RE-CRAFT sedang memproses...',
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return <LoadingOverlayContent steps={steps} subtitle={subtitle} />;
}

function LoadingOverlayContent({
  steps,
  subtitle,
}: Required<Pick<LoadingOverlayProps, 'subtitle'>> &
  Pick<LoadingOverlayProps, 'steps'>) {
  const activeSteps =
    steps && steps.length > 0 ? steps : scanService.getAnalysisSteps();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % activeSteps.length);
    }, 1150);

    return () => clearInterval(interval);
  }, [activeSteps.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md">
      {/* Animasi SVG Blueprint Teknik */}
      <div className="mb-8 rounded-2xl border border-sky/30 bg-navy/40 p-4 shadow-glow">
        <svg
          viewBox="0 0 200 200"
          className="h-28 w-28"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern
              id="recraftBlueprintGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#3B9FD9"
                strokeOpacity="0.25"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill="url(#recraftBlueprintGrid)" rx="12" />
          <rect
            x="30"
            y="30"
            width="140"
            height="140"
            fill="none"
            stroke="#3B9FD9"
            strokeWidth="2.5"
            strokeDasharray="560"
            strokeDashoffset="560"
            className="animate-blueprint-draw"
          />
          <line
            x1="30"
            y1="100"
            x2="170"
            y2="100"
            stroke="#E0F2FE"
            strokeWidth="1.5"
            strokeDasharray="6,4"
          />
          <line
            x1="100"
            y1="30"
            x2="100"
            y2="170"
            stroke="#E0F2FE"
            strokeWidth="1.5"
            strokeDasharray="6,4"
          />
        </svg>
      </div>

      {/* Teks Progres 3 Langkah */}
      <div className="mb-8 text-center">
        <p className="mb-1.5 min-h-7 text-lg font-bold text-white">
          {activeSteps[currentStep]}
        </p>
        <p className="text-sm text-sky-light/80">{subtitle}</p>
      </div>

      {/* Bar Progres */}
      <div className="w-full max-w-xs">
        <div className="mb-3 flex gap-2">
          {activeSteps.map((stepLabel, index) => (
            <div
              key={stepLabel}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                index <= currentStep ? 'bg-sky' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="text-center font-mono text-xs text-sky-light">
          Langkah {currentStep + 1} / {activeSteps.length}
        </p>
      </div>
    </div>
  );
}
