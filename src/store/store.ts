import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      initialVolume: 50,
      handleVolume: (name: string, value: number) => {
        console.log({ name, value });
        return set((state: any) => ({ ...state, [name]: value }));
      },
    }),
    {
      name: 'devicesStore', // unique name
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    },
  ),
);
