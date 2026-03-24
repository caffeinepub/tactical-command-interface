/**
 * useTestModeStore — V17.2 Test Mode
 *
 * When warEnabled is false:
 *   - ThreatManager skips automatic hostile spawns
 *   - Battle escalation is suppressed
 *   - Manual weapon testing still works (player can still fire)
 *
 * Persisted in sessionStorage (resets on browser close).
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TestModeState {
  warEnabled: boolean;
  toggleWar: () => void;
  setWarEnabled: (v: boolean) => void;
}

export const useTestModeStore = create<TestModeState>()(
  persist(
    (set) => ({
      warEnabled: true,

      toggleWar: () => set((s) => ({ warEnabled: !s.warEnabled })),

      setWarEnabled: (v) => set({ warEnabled: v }),
    }),
    {
      name: "tci_testmode_v1",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
