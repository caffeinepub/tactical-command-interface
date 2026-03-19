import { create } from "zustand";

interface SubtitleState {
  text: string | null;
  _timer: ReturnType<typeof setTimeout> | null;
  show: (text: string, ms?: number) => void;
  clear: () => void;
}

export const useSubtitleStore = create<SubtitleState>((set, get) => ({
  text: null,
  _timer: null,
  show: (text: string, ms?: number) => {
    const existing = get()._timer;
    if (existing) clearTimeout(existing);
    if (ms && ms > 0) {
      const timer = setTimeout(() => set({ text: null, _timer: null }), ms);
      set({ text, _timer: timer });
    } else {
      set({ text, _timer: null });
    }
  },
  clear: () => {
    const existing = get()._timer;
    if (existing) clearTimeout(existing);
    set({ text: null, _timer: null });
  },
}));
