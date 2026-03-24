/**
 * useShipStore — V17.2
 *
 * Added:
 *   addOrbital(dTheta, dPhi) — direct delta for drag input (bypasses velocity).
 *   setOrbitalRadius(r)      — direct zoom for pinch input.
 *
 * Friction raised from 0.88 → 0.94 so joystick coasting stops faster.
 */
import { create } from "zustand";

export interface ShipState {
  orbitalTheta: number;
  orbitalPhi: number;
  orbitalRadius: number;
  headingYaw: number;
  headingPitch: number;
  velTheta: number;
  velPhi: number;
}

export interface ShipActions {
  setOrbital: (theta: number, phi: number) => void;
  addOrbital: (dTheta: number, dPhi: number) => void;
  setOrbitalRadius: (r: number) => void;
  setHeading: (yaw: number, pitch: number) => void;
  setVelocity: (velTheta: number, velPhi: number) => void;
  applyVelocityTick: (dt: number) => void;
}

export const useShipStore = create<ShipState & ShipActions>((set, get) => ({
  orbitalTheta: 0,
  orbitalPhi: 0.18,
  orbitalRadius: 5.0,
  headingYaw: 0,
  headingPitch: 0,
  velTheta: 0,
  velPhi: 0,

  setOrbital: (theta, phi) =>
    set({
      orbitalTheta: theta,
      orbitalPhi: Math.max(-1.3, Math.min(1.3, phi)),
    }),

  /** Direct delta update from touch drag — no velocity side-effects. */
  addOrbital: (dTheta, dPhi) => {
    const s = get();
    set({
      orbitalTheta: s.orbitalTheta + dTheta,
      orbitalPhi: Math.max(-1.3, Math.min(1.3, s.orbitalPhi + dPhi)),
    });
  },

  /** Direct zoom from pinch gesture. */
  setOrbitalRadius: (r) =>
    set({ orbitalRadius: Math.max(2.8, Math.min(9.0, r)) }),

  setHeading: (yaw, pitch) =>
    set({
      headingYaw: Math.max(-0.35, Math.min(0.35, yaw)),
      headingPitch: Math.max(-0.25, Math.min(0.25, pitch)),
    }),

  setVelocity: (velTheta, velPhi) => set({ velTheta, velPhi }),

  applyVelocityTick: (dt) => {
    const s = get();
    const newTheta = s.orbitalTheta + s.velTheta * dt;
    const newPhi = Math.max(-1.3, Math.min(1.3, s.orbitalPhi + s.velPhi * dt));
    // Raised friction: 0.88 → 0.94 so velocity decays faster (less spin coast)
    const friction = 0.94;
    const nVT = s.velTheta * friction;
    const nVP = s.velPhi * friction;
    const hd = 0.965;
    set({
      orbitalTheta: newTheta,
      orbitalPhi: newPhi,
      velTheta: Math.abs(nVT) < 0.00001 ? 0 : nVT,
      velPhi: Math.abs(nVP) < 0.00001 ? 0 : nVP,
      headingYaw: s.headingYaw * hd,
      headingPitch: s.headingPitch * hd,
    });
  },
}));
