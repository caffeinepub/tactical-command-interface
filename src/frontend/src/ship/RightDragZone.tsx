/**
 * GlobeDragZone — V17.2 complete rewrite.
 *
 * ROOT CAUSE of bumpy/jumping spin:
 *   1. Old code called setVelocity() on every pointer-move → velocity
 *      accumulated each frame, then shipMovementEngine ALSO added velocity
 *      from joystick input → double-update, jumpy spin.
 *   2. No pinch-to-zoom support.
 *   3. setPointerCapture on pointer-down swallowed taps before Three.js
 *      could raycast them.
 *
 * V17.2 FIX:
 *   - Direct orbital position update on drag (NO velocity accumulation).
 *   - Multi-touch pinch → orbital radius (zoom).
 *   - Tap (< TAP_THRESHOLD pixels) → pointer-events pass through to Three.js.
 *   - Single authoritative input path: this zone OR joystick, not both.
 *   - Light inertia on release (RAF-based exponential decay).
 *
 * LAYER ORDER:
 *   Globe Canvas z-index:1  → receives tap raycasts
 *   RightDragZone z-index:2 → receives drag/pinch only after threshold
 *   HUD overlays z-index:10+ pointer-events:none
 *   Buttons/panels         pointer-events:auto
 */
import { useCallback, useEffect, useRef } from "react";
import { useTutorialStore } from "../tutorial/useTutorialStore";
import { useShipStore } from "./useShipStore";

// Sensitivities — tuned for V17.2 (lower = slower/smoother)
const DRAG_SENS_X = 0.004; // azimuth rad per pixel
const DRAG_SENS_Y = 0.003; // elevation rad per pixel
const PINCH_SENS = 0.012; // radius units per pixel of pinch delta
const INERTIA_DECAY = 0.88; // per frame (higher = longer coast)
const INERTIA_CUTOFF = 0.00005;

// Tap vs drag discriminator
const TAP_THRESHOLD = 10; // pixels

interface PointerTrack {
  id: number;
  x: number;
  y: number;
}

export default function RightDragZone() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointers = useRef<PointerTrack[]>([]);
  const dragState = useRef<{
    active: boolean;
    lastX: number;
    lastY: number;
    totalDist: number;
    captured: boolean;
  }>({
    active: false,
    lastX: 0,
    lastY: 0,
    totalDist: 0,
    captured: false,
  });
  const pinchState = useRef<{ lastDist: number }>({ lastDist: 0 });
  const inertia = useRef<{ vx: number; vy: number; rafId: number | null }>({
    vx: 0,
    vy: 0,
    rafId: null,
  });

  const tutorialActive = useTutorialStore((s) => s.tutorialActive);
  const tutorialStep = useTutorialStore((s) => s.currentStep);
  // During target/lock steps let ALL events reach the Three.js canvas
  const passThrough =
    tutorialActive && (tutorialStep === "target" || tutorialStep === "lock");

  // ── Inertia loop ────────────────────────────────────────────────────────
  const stopInertia = useCallback(() => {
    if (inertia.current.rafId !== null) {
      cancelAnimationFrame(inertia.current.rafId);
      inertia.current.rafId = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      stopInertia();
      inertia.current.vx = vx;
      inertia.current.vy = vy;

      function tick() {
        const iv = inertia.current;
        if (
          Math.abs(iv.vx) < INERTIA_CUTOFF &&
          Math.abs(iv.vy) < INERTIA_CUTOFF
        ) {
          iv.rafId = null;
          return;
        }
        const s = useShipStore.getState();
        s.addOrbital(iv.vx, iv.vy);
        iv.vx *= INERTIA_DECAY;
        iv.vy *= INERTIA_DECAY;
        iv.rafId = requestAnimationFrame(tick);
      }
      inertia.current.rafId = requestAnimationFrame(tick);
    },
    [stopInertia],
  );

  // ── Raw DOM listeners (attached once) ────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function getPinchDist() {
      const pts = pointers.current;
      if (pts.length < 2) return 0;
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function onPointerDown(e: PointerEvent) {
      // Track this pointer
      pointers.current = pointers.current.filter((p) => p.id !== e.pointerId);
      pointers.current.push({ id: e.pointerId, x: e.clientX, y: e.clientY });

      if (pointers.current.length === 2) {
        // Starting a pinch
        pinchState.current.lastDist = getPinchDist();
        dragState.current.active = false;
        stopInertia();
        return;
      }

      if (pointers.current.length === 1) {
        // Starting a potential drag
        stopInertia();
        dragState.current = {
          active: true,
          lastX: e.clientX,
          lastY: e.clientY,
          totalDist: 0,
          captured: false,
        };
      }
    }

    function onPointerMove(e: PointerEvent) {
      // Update tracked position
      const idx = pointers.current.findIndex((p) => p.id === e.pointerId);
      if (idx >= 0) {
        pointers.current[idx].x = e.clientX;
        pointers.current[idx].y = e.clientY;
      }

      // Pinch zoom (two-finger)
      if (pointers.current.length === 2) {
        const dist = getPinchDist();
        const prev = pinchState.current.lastDist;
        if (prev > 0) {
          const delta = prev - dist; // positive = fingers moving together = zoom in
          const s = useShipStore.getState();
          s.setOrbitalRadius(
            Math.max(2.8, Math.min(9.0, s.orbitalRadius + delta * PINCH_SENS)),
          );
        }
        pinchState.current.lastDist = dist;
        return;
      }

      // Single-finger drag
      const ds = dragState.current;
      if (!ds.active) return;
      if (e.pointerId !== (pointers.current[0]?.id ?? -1)) return;

      const dx = e.clientX - ds.lastX;
      const dy = e.clientY - ds.lastY;
      ds.lastX = e.clientX;
      ds.lastY = e.clientY;
      ds.totalDist += Math.sqrt(dx * dx + dy * dy);

      // Only start updating orbit after TAP_THRESHOLD (so short taps reach Three.js)
      if (ds.totalDist < TAP_THRESHOLD) return;

      // Capture pointer once we know it's a drag
      if (!ds.captured) {
        ds.captured = true;
        try {
          (el as HTMLDivElement).setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }

      // Store last velocity for inertia
      inertia.current.vx = -dx * DRAG_SENS_X;
      inertia.current.vy = dy * DRAG_SENS_Y;

      // Direct orbital position update — NO velocity accumulation
      const s = useShipStore.getState();
      s.addOrbital(-dx * DRAG_SENS_X, dy * DRAG_SENS_Y);
    }

    function onPointerUp(e: PointerEvent) {
      pointers.current = pointers.current.filter((p) => p.id !== e.pointerId);

      const ds = dragState.current;
      if (ds.active && ds.captured) {
        // Launch inertia
        startInertia(inertia.current.vx, inertia.current.vy);
      }
      if (pointers.current.length < 2) {
        pinchState.current.lastDist = 0;
      }
      if (pointers.current.length === 0) {
        dragState.current = {
          active: false,
          lastX: 0,
          lastY: 0,
          totalDist: 0,
          captured: false,
        };
      }
    }

    el.addEventListener("pointerdown", onPointerDown, { passive: true });
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerup", onPointerUp, { passive: true });
    el.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      stopInertia();
    };
  }, [startInertia, stopInertia]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        touchAction: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        // Pass through to globe canvas during target steps
        pointerEvents: passThrough ? "none" : "auto",
        background: "transparent",
      }}
    />
  );
}
