import { SIMULATED_TIMEOUTS } from '@/config/environment';
import type {
  CollabProposal,
  CraftTargetOption,
  MarketProduct,
  MaterialListing,
  ProjectSummary,
  ScanResult,
  ToolOption,
} from '@/types';
import type { Studio3DPayload } from '@/types/studio';
import { simulatedNetworkDelay } from '@/utils/delay';
import {
  DEFAULT_STUDIO_PROJECT_ID,
  getMockStudioPayload,
  mockAnalysisSteps,
  mockCollabProposals,
  mockCraftTargets,
  mockMarketProducts,
  mockMaterialListings,
  mockProjects,
  mockScanResults,
  mockTools,
} from './mockData';

export const mockScanService = {
  async scanFromCamera(photoDataUrl?: string): Promise<ScanResult> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.SCAN_ANALYSIS);
    const base = mockScanResults[0];
    return {
      ...base,
      photoUrl: photoDataUrl || base.photoUrl,
      timestampIso: new Date().toISOString(),
    };
  },

  async scanFromUpload(file: File): Promise<ScanResult> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.SCAN_ANALYSIS);
    const base = mockScanResults[1] ?? mockScanResults[0];
    const objectUrl = URL.createObjectURL(file);
    return {
      ...base,
      photoUrl: objectUrl,
      timestampIso: new Date().toISOString(),
    };
  },

  async getTools(): Promise<ToolOption[]> {
    return mockTools;
  },

  async getCraftTargets(): Promise<CraftTargetOption[]> {
    return mockCraftTargets;
  },

  getAnalysisSteps(): readonly string[] {
    return mockAnalysisSteps;
  },

  createManualScanDraft(): ScanResult {
    const base = mockScanResults[0];
    return {
      ...base,
      id: `SCAN_MANUAL_${Date.now()}`,
      materialType: 'Input Dimensi Manual',
      dimensions: { panjang: 30, lebar: 20, tinggi: 15 },
      confidence: 1,
      timestampIso: new Date().toISOString(),
      detectedMaterials: ['Input Manual Pengguna'],
    };
  },
};

export const mockStudioService = {
  async getStudio3D(projectId: string): Promise<Studio3DPayload> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.MARKET_FETCH);
    return getMockStudioPayload(projectId);
  },

  async generateStudio3D(params: {
    scan: ScanResult;
    toolIds: string[];
    targetId: string;
  }): Promise<Studio3DPayload> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.ARCHITECT_GENERATION);
    const matchedTarget = mockCraftTargets.find((t) => t.id === params.targetId);
    const basePayload = getMockStudioPayload(
      matchedTarget?.studioProjectId ?? DEFAULT_STUDIO_PROJECT_ID
    );

    const hasHotGlue = params.toolIds.includes('T4');
    const noteSuffix = hasHotGlue
      ? 'Diperkuat perekat lem tembak pada titik kunci.'
      : 'Diadaptasi menjadi sambungan selip kunci (slot-and-tab) tanpa lem panas.';

    return {
      ...basePayload,
      architectureSummary: `${basePayload.architectureSummary} (${noteSuffix})`,
      primaryScrapMaterial: `${params.scan.materialType} (${params.scan.dimensions.panjang}×${params.scan.dimensions.lebar}×${params.scan.dimensions.tinggi} cm)`,
    };
  },
};

export const mockProjectService = {
  async getProjects(): Promise<ProjectSummary[]> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.MARKET_FETCH);
    return mockProjects;
  },
};

export const mockMarketService = {
  async getProducts(): Promise<MarketProduct[]> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.MARKET_FETCH);
    return mockMarketProducts;
  },

  async getMaterialListings(): Promise<MaterialListing[]> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.MARKET_FETCH);
    return mockMaterialListings;
  },

  async getCollabProposals(): Promise<CollabProposal[]> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.MARKET_FETCH);
    return mockCollabProposals;
  },

  async submitCollabProposal(
    input: Omit<CollabProposal, 'id' | 'status'>
  ): Promise<CollabProposal> {
    await simulatedNetworkDelay(SIMULATED_TIMEOUTS.MARKET_FETCH);
    return {
      ...input,
      id: `COL_${Date.now()}`,
      status: 'MENUNGGU',
    };
  },
};
