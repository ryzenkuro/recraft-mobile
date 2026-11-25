import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import type { StateStorage } from 'zustand/middleware';

export const capacitorStateStorage: StateStorage = {
  async getItem(name: string): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      return window.localStorage.getItem(name);
    }
    const { value } = await Preferences.get({ key: name });
    return value;
  },

  async setItem(name: string, value: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      window.localStorage.setItem(name, value);
      return;
    }
    await Preferences.set({ key: name, value });
  },

  async removeItem(name: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      window.localStorage.removeItem(name);
      return;
    }
    await Preferences.remove({ key: name });
  },
};
