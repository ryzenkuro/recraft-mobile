import { API_BASE_URL, USE_MOCK_DATA } from '@/config/environment';
import { mockStudioService } from '@/mocks';
import type { ScanResult } from '@/types';
import type { Studio3DPayload } from '@/types/studio';

export interface StudioService {
  getStudio3D: (projectId: string) => Promise<Studio3DPayload>;
  generateStudio3D: (params: {
    scan: ScanResult;
    toolIds: string[];
    targetId: string;
  }) => Promise<Studio3DPayload>;
}

const apiStudioService: StudioService = {
  async getStudio3D(projectId: string): Promise<Studio3DPayload> {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/studio-3d`);
    if (!res.ok) throw new Error('Gagal memuat data Studio 3D.');
    return res.json() as Promise<Studio3DPayload>;
  },

  async generateStudio3D(params: {
    scan: ScanResult;
    toolIds: string[];
    targetId: string;
  }): Promise<Studio3DPayload> {
    const res = await fetch(`${API_BASE_URL}/studio/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Gagal merancang model 3D.');
    return res.json() as Promise<Studio3DPayload>;
  },
};

export const studioService: StudioService = USE_MOCK_DATA
  ? mockStudioService
  : apiStudioService;
