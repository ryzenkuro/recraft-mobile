export type MaterialStrength = 'LIGHT' | 'MEDIUM' | 'HEAVY';

export interface StudioComponentSpec {
  code: string;
  name: string;
  qty: number;
  dimensionsMm: [number, number, number];
  explodeVector: [number, number, number];
  meshPosition: [number, number, number];
  meshSize: [number, number, number];
  colorHex: string;
  materialNote: string;
  cuttingNote: string;
  foldingNote: string;
  assemblyNote: string;
  connectedCodes: string[];
  svgRect: { x: number; y: number; w: number; h: number };
}

export interface Studio3DPayload {
  projectId: string;
  title: string;
  architectureSummary: string;
  primaryScrapMaterial: string;
  strengthCategory: MaterialStrength;
  estimatedValueRangeIdr: [number, number];
  glbUrl?: string;
  cuttingMapSvg: string;
  components: StudioComponentSpec[];
}
