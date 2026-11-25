import { API_BASE_URL, USE_MOCK_DATA } from '@/config/environment';
import { mockProjectService } from '@/mocks';
import type { ProjectSummary } from '@/types';

export interface ProjectService {
  getProjects: () => Promise<ProjectSummary[]>;
}

const apiProjectService: ProjectService = {
  async getProjects(): Promise<ProjectSummary[]> {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('Gagal memuat daftar proyek.');
    return res.json() as Promise<ProjectSummary[]>;
  },
};

export const projectService: ProjectService = USE_MOCK_DATA
  ? mockProjectService
  : apiProjectService;
