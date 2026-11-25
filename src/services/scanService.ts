import { API_BASE_URL, USE_MOCK_DATA } from '@/config/environment';
import { mockScanService } from '@/mocks';
import type { CraftTargetOption, ScanResult, ToolOption } from '@/types';

export interface ScanService {
  scanFromCamera: (photoDataUrl?: string) => Promise<ScanResult>;
  scanFromUpload: (file: File) => Promise<ScanResult>;
  getTools: () => Promise<ToolOption[]>;
  getCraftTargets: () => Promise<CraftTargetOption[]>;
  getAnalysisSteps: () => readonly string[];
  createManualScanDraft: () => ScanResult;
}

const apiScanService: ScanService = {
  async scanFromCamera(photoDataUrl?: string): Promise<ScanResult> {
    const res = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoDataUrl }),
    });
    if (!res.ok) throw new Error('Gagal memindai barang bekas.');
    return res.json() as Promise<ScanResult>;
  },

  async scanFromUpload(file: File): Promise<ScanResult> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE_URL}/scan/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Gagal mengunggah gambar.');
    return res.json() as Promise<ScanResult>;
  },

  async getTools(): Promise<ToolOption[]> {
    const res = await fetch(`${API_BASE_URL}/studio/tools`);
    if (!res.ok) throw new Error('Gagal memuat daftar alat.');
    return res.json() as Promise<ToolOption[]>;
  },

  async getCraftTargets(): Promise<CraftTargetOption[]> {
    const res = await fetch(`${API_BASE_URL}/studio/targets`);
    if (!res.ok) throw new Error('Gagal memuat rekomendasi karya.');
    return res.json() as Promise<CraftTargetOption[]>;
  },

  getAnalysisSteps(): readonly string[] {
    return mockScanService.getAnalysisSteps();
  },

  createManualScanDraft(): ScanResult {
    return mockScanService.createManualScanDraft();
  },
};

export const scanService: ScanService = USE_MOCK_DATA
  ? mockScanService
  : apiScanService;
