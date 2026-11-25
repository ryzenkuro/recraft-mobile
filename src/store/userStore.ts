import { create } from 'zustand';
import { mockUserProfile } from '@/mocks';
import type { UserProfile, UserRole } from '@/types';

interface UserStoreState {
  profile: UserProfile;
  switchRole: (role: UserRole) => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  profile: mockUserProfile,

  switchRole: (role) =>
    set((state) => ({
      profile: { ...state.profile, activeRole: role },
    })),

  resetProfile: () => set({ profile: mockUserProfile }),
}));
