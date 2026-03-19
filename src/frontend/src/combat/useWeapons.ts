import { create } from "zustand";
import { useThreatStore } from "../combat/useThreatStore";
import { useTacticalStore } from "../useTacticalStore";
import { useCombatState } from "./useCombatState";

export interface Weapon {
  id: string;
  name: string;
  shortLabel: string;
  cooldownTime: number;
  currentCooldown: number;
  status: "READY" | "COOLDOWN";
  type: "pulse" | "railgun" | "emp";
  color: string;
  glowColor: string;
}

const INITIAL_WEAPONS: Weapon[] = [
  {
    id: "pulse",
    name: "PULSE CANNON",
    shortLabel: "PCN",
    cooldownTime: 1200,
    currentCooldown: 0,
    status: "READY",
    type: "pulse",
    color: "#00ffcc",
    glowColor: "rgba(0,255,200,0.4)",
  },
  {
    id: "rail",
    name: "RAIL GUN",
    shortLabel: "RLG",
    cooldownTime: 3500,
    currentCooldown: 0,
    status: "READY",
    type: "railgun",
    color: "#44aaff",
    glowColor: "rgba(68,170,255,0.4)",
  },
  {
    id: "emp",
    name: "EMP BURST",
    shortLabel: "EMP",
    cooldownTime: 5000,
    currentCooldown: 0,
    status: "READY",
    type: "emp",
    color: "#ff8800",
    glowColor: "rgba(255,136,0,0.4)",
  },
];

interface WeaponsStore {
  weapons: Weapon[];
  fire: (weaponId: string) => void;
  tick: (dtMs: number) => void;
}

export const useWeaponsStore = create<WeaponsStore>((set, get) => ({
  weapons: INITIAL_WEAPONS,

  fire: (weaponId: string) => {
    const { selectedNode } = useTacticalStore.getState();
    if (!selectedNode) return;

    const weapon = get().weapons.find((w) => w.id === weaponId);
    if (!weapon || weapon.status !== "READY") return;

    const {
      setFiringEffect,
      setTargetHitFlash,
      setEmpStunnedNode,
      setScreenFlash,
      setCameraShake,
      setDestructionEvent,
    } = useCombatState.getState();

    const duration =
      weapon.type === "pulse" ? 350 : weapon.type === "railgun" ? 550 : 1100;

    setFiringEffect({
      weaponId,
      type: weapon.type,
      targetId: selectedNode,
      startTime: performance.now(),
      duration,
    });

    // Camera shake on fire
    setCameraShake({
      intensity:
        weapon.type === "railgun" ? 0.06 : weapon.type === "emp" ? 0.04 : 0.025,
      weaponType: weapon.type,
      startTime: performance.now(),
      duration:
        weapon.type === "railgun" ? 400 : weapon.type === "emp" ? 350 : 250,
    });

    setTargetHitFlash(true);
    setScreenFlash(true);

    setTimeout(() => setTargetHitFlash(false), duration);
    setTimeout(() => setScreenFlash(false), 120);
    setTimeout(() => setFiringEffect(null), duration + 100);

    if (weapon.type === "emp") {
      setEmpStunnedNode(selectedNode);
      setTimeout(() => setEmpStunnedNode(null), 3000);
    }

    // Intercept threat if targeting one
    if (selectedNode.startsWith("THREAT-")) {
      const { interceptThreat } = useThreatStore.getState();
      interceptThreat(selectedNode, weapon.type);

      // Check if destroyed after intercept
      const updatedThreat = useThreatStore
        .getState()
        .threats.find((t) => t.id === selectedNode);
      if (updatedThreat?.status === "DESTROYED") {
        setDestructionEvent({
          targetId: selectedNode,
          startTime: performance.now(),
          weaponType: weapon.type,
        });
      }
    }

    set((state) => ({
      weapons: state.weapons.map((w) =>
        w.id === weaponId
          ? { ...w, status: "COOLDOWN" as const, currentCooldown: 1 }
          : w,
      ),
    }));
  },

  tick: (dtMs: number) => {
    set((state) => ({
      weapons: state.weapons.map((w) => {
        if (w.status !== "COOLDOWN") return w;
        const next = w.currentCooldown - dtMs / w.cooldownTime;
        if (next <= 0)
          return { ...w, currentCooldown: 0, status: "READY" as const };
        return { ...w, currentCooldown: next };
      }),
    }));
  },
}));
