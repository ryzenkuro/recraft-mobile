import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { projectService } from '@/services/projectService';
import type { ProjectCategory, ProjectSummary } from '@/types';
import { capacitorStateStorage } from './capacitorStorage';

interface ProjectStoreState {
  projects: ProjectSummary[];
  activeTab: ProjectCategory;
  searchQuery: string;
  isLoading: boolean;
  hasHydratedFromService: boolean;

  fetchProjects: (force?: boolean) => Promise<void>;
  setProjects: (projects: ProjectSummary[]) => void;
  addProject: (project: ProjectSummary) => void;
  toggleOffline: (projectId: string) => void;
  clearOfflineCache: () => void;
  setActiveTab: (tab: ProjectCategory) => void;
  setSearchQuery: (query: string) => void;
  getFilteredProjects: () => ProjectSummary[];
}

export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeTab: 'KARYA',
      searchQuery: '',
      isLoading: false,
      hasHydratedFromService: false,

      fetchProjects: async (force = false) => {
        if (get().projects.length > 0 && !force) return;
        set({ isLoading: true });
        try {
          const items = await projectService.getProjects();
          set({
            projects: items,
            isLoading: false,
            hasHydratedFromService: true,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({
          projects: [
            project,
            ...state.projects.filter((existing) => existing.id !== project.id),
          ],
        })),

      toggleOffline: (projectId) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, offlineAvailable: !p.offlineAvailable }
              : p
          ),
        })),

      clearOfflineCache: () =>
        set((state) => ({
          projects: state.projects.map((p) => ({
            ...p,
            offlineAvailable: false,
          })),
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      getFilteredProjects: () => {
        const { projects, activeTab, searchQuery } = get();
        const q = searchQuery.trim().toLowerCase();

        return projects.filter((project) => {
          const matchesTab =
            activeTab === 'KARYA'
              ? true
              : activeTab === 'OFFLINE'
                ? project.offlineAvailable
                : project.inProduction;

          if (!matchesTab) return false;
          if (!q) return true;

          return (
            project.name.toLowerCase().includes(q) ||
            project.materialLabel.toLowerCase().includes(q)
          );
        });
      },
    }),
    {
      name: 'recraft-projects-cache',
      storage: createJSONStorage(() => capacitorStateStorage),
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);
