/**
 * useCreditsStore — Dedicated global credits store
 * Persisted: tci_credits_v1
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const TUTORIAL_BONUS = 200;
export const ALERT_RESOLVE_REWARD = 150;
export const MISSION_REWARD = 300;
export const THREAT_DESTROY_REWARD = 25;

export interface CreditTransaction {
  id: string;
  amount: number;
  reason: string;
  ts: number;
}

interface CreditsState {
  balance: number;
  transactions: CreditTransaction[];
  earn: (amount: number, reason: string) => void;
  spend: (amount: number, reason: string) => boolean;
  getBalance: () => number;
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      balance: 1000,
      transactions: [],

      earn: (amount, reason) => {
        if (amount <= 0) return;
        const entry: CreditTransaction = {
          id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          amount,
          reason,
          ts: Date.now(),
        };
        set((s) => ({
          balance: s.balance + amount,
          transactions: [entry, ...s.transactions].slice(0, 50),
        }));
      },

      spend: (amount, reason) => {
        const s = get();
        if (s.balance < amount) return false;
        const entry: CreditTransaction = {
          id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          amount: -amount,
          reason,
          ts: Date.now(),
        };
        set((prev) => ({
          balance: prev.balance - amount,
          transactions: [entry, ...prev.transactions].slice(0, 50),
        }));
        return true;
      },

      getBalance: () => get().balance,
    }),
    {
      name: "tci_credits_v1",
      partialize: (s) => ({ balance: s.balance, transactions: s.transactions }),
    },
  ),
);
