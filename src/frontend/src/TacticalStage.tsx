import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import GlobeCore, { NODE_COUNT } from "./GlobeCore";
import HudOverlay from "./HudOverlay";
import SmokeTestPanel from "./SmokeTestPanel";
import CockpitAmbientFx from "./cockpit/CockpitAmbientFx";
import CockpitFrame from "./cockpit/CockpitFrame";
import SideEnclosure from "./cockpit/SideEnclosure";
import CombatEffectsLayer from "./combat/CombatEffectsLayer";
import WeaponDeck from "./combat/WeaponDeck";
import { useThreatStore } from "./combat/useThreatStore";
import { useWeaponsStore } from "./combat/useWeapons";
import CommandDashboard from "./dashboard/CommandDashboard";
import CoordinateDisplay from "./globe/CoordinateDisplay";
import LeftPanel from "./hud/LeftPanel";
import RightPanel from "./hud/RightPanel";
import ShipMotionLayer from "./motion/ShipMotionLayer";
import CheckpointMarkers from "./qa/CheckpointMarkers";
import { runSmokeTests } from "./smokeTest";
import CameraController from "./three/CameraController";
import InterceptSystem from "./three/InterceptSystem";
import SpaceBackground from "./three/SpaceBackground";
import ThreatManager from "./three/ThreatManager";
import { useDashboardStore } from "./useDashboardStore";
import { useTacticalStore } from "./useTacticalStore";

function compactBtnStyle(
  active: boolean,
  activeColor: string,
): React.CSSProperties {
  return {
    padding: "4px 10px",
    fontFamily: "monospace",
    fontSize: "clamp(8px, 0.85vw, 10px)",
    letterSpacing: "0.18em",
    fontWeight: 700,
    color: active ? activeColor : "rgba(0,200,255,0.75)",
    background: active ? "rgba(0,50,70,0.9)" : "rgba(0,8,20,0.82)",
    border: `1px solid ${active ? `${activeColor}99` : "rgba(0,200,255,0.3)"}`,
    borderRadius: 2,
    cursor: "pointer",
    backdropFilter: "blur(6px)",
    boxShadow: active ? `0 0 10px ${activeColor}44` : "none",
    transition: "all 0.2s ease",
    minHeight: 30,
    whiteSpace: "nowrap" as const,
    pointerEvents: "auto" as const,
  };
}

/** Interactive HUD controls — always rendered above cockpit frame */
function HudControls() {
  const selectedNode = useTacticalStore((s) => s.selectedNode);
  const scanMode = useTacticalStore((s) => s.scanMode);
  const toggleScanMode = useTacticalStore((s) => s.toggleScanMode);
  const clearNode = useTacticalStore((s) => s.clearNode);
  const dashboardOpen = useDashboardStore((s) => s.dashboardOpen);
  const openDashboard = useDashboardStore((s) => s.openDashboard);

  return (
    <>
      {/* Top-right: SCAN + CMD buttons */}
      <div
        style={{
          position: "absolute",
          top: "clamp(8px, 1.8vh, 18px)",
          right: "clamp(10px, 2.5vw, 36px)",
          display: "flex",
          gap: 6,
          pointerEvents: "auto",
        }}
      >
        <button
          type="button"
          onClick={toggleScanMode}
          style={compactBtnStyle(scanMode, "#00ffcc")}
        >
          {scanMode ? "◉ SCAN" : "◎ SCAN"}
        </button>
        <button
          type="button"
          onClick={() => openDashboard("command")}
          style={compactBtnStyle(dashboardOpen, "#00ccff")}
        >
          {dashboardOpen ? "⬡ SYS" : "⬡ CMD"}
        </button>
      </div>

      {/* Top-left: target indicator + CLR */}
      <div
        style={{
          position: "absolute",
          top: "clamp(8px, 1.8vh, 18px)",
          left: "clamp(10px, 2.5vw, 36px)",
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "clamp(8px, 0.9vw, 10px)",
            letterSpacing: "0.18em",
            color: selectedNode ? "#00ffcc" : "rgba(0,180,255,0.4)",
            textShadow: selectedNode ? "0 0 8px #00ffcc88" : "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {selectedNode ? `▸ LOCKED — ${selectedNode}` : "▸ NO TARGET"}
        </span>
        {selectedNode && (
          <button
            type="button"
            onClick={clearNode}
            style={{
              fontFamily: "monospace",
              fontSize: 7,
              letterSpacing: "0.12em",
              color: "rgba(0,160,200,0.5)",
              background: "transparent",
              border: "1px solid rgba(0,160,200,0.2)",
              borderRadius: 2,
              cursor: "pointer",
              padding: "1px 5px",
              pointerEvents: "auto",
            }}
          >
            CLR
          </button>
        )}
      </div>
    </>
  );
}

export default function TacticalStage() {
  const canvasMountedRef = useRef(false);
  const [, forceUpdate] = useState(0);
  const setSmokeResults = useTacticalStore((s) => s.setSmokeResults);

  useEffect(() => {
    const handleResize = () => forceUpdate((n) => n + 1);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    canvasMountedRef.current = true;
    const timer = setTimeout(() => {
      const store = useTacticalStore.getState();
      const threatStore = useThreatStore.getState();
      const weaponStore = useWeaponsStore.getState();

      void threatStore;
      void weaponStore;

      const results = runSmokeTests({
        canvasMounted: canvasMountedRef.current,
        nodeCount: NODE_COUNT,
        selectedNode: store.selectedNode,
        scanMode: store.scanMode,
        nodeData: store.nodeData,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      const record: Record<string, boolean> = {};
      for (const r of results) {
        record[r.label] = r.pass;
      }
      setSmokeResults(record);
    }, 500);
    return () => clearTimeout(timer);
  }, [setSmokeResults]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000008",
      }}
      className="tactical-stage"
    >
      {/* ===== LAYER 1 (z:1) — Globe canvas ===== */}
      <ShipMotionLayer factor={1.0} zIndex={1}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 52 }}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 40%, #03071a 0%, #010208 65%, #000003 100%)",
          }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.08} />
          <directionalLight
            position={[5, 2, 3]}
            intensity={2.8}
            color="#fff5e0"
          />
          <pointLight
            position={[-4, -1, -2]}
            intensity={0.35}
            color="#1a3fff"
          />
          <SpaceBackground />
          <CameraController />
          <GlobeCore />
          <CombatEffectsLayer />
          <ThreatManager />
          <InterceptSystem />
        </Canvas>
      </ShipMotionLayer>

      {/* ===== LAYER 2 (z:8) — Side enclosure (decorative only) ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 8,
          pointerEvents: "none",
        }}
      >
        <SideEnclosure />
      </div>

      {/* ===== LAYER 3 (z:10) — HUD SVG decorations (no pointer events) ===== */}
      <ShipMotionLayer
        factor={0.55}
        zIndex={10}
        style={{ pointerEvents: "none" }}
      >
        <HudOverlay />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <CoordinateDisplay />
        </div>
      </ShipMotionLayer>

      {/* ===== LAYER 4 (z:12) — Cockpit ambient FX ===== */}
      <ShipMotionLayer
        factor={0.15}
        zIndex={12}
        style={{ pointerEvents: "none" }}
      >
        <CockpitAmbientFx />
      </ShipMotionLayer>

      {/* ===== LAYER 5 (z:15) — Cockpit frame image (pointer-events:none, mix-blend-mode:multiply) ===== */}
      <ShipMotionLayer
        factor={0.2}
        zIndex={15}
        style={{ pointerEvents: "none" }}
      >
        <CockpitFrame />
      </ShipMotionLayer>

      {/* ===== LAYER 6 (z:30) — Left + Right glass panels ===== */}
      <LeftPanel />
      <RightPanel />

      {/* ===== LAYER 7 (z:35) — Weapon deck ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 35,
          pointerEvents: "none",
        }}
      >
        <WeaponDeck />
      </div>

      {/* ===== LAYER 8 (z:40) — HUD interactive controls (SCAN, CMD, CLR) ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 40,
          pointerEvents: "none",
        }}
      >
        <HudControls />
      </div>

      {/* ===== LAYER 9 (z:45) — QA checkpoint markers ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 45,
          pointerEvents: "none",
        }}
      >
        <CheckpointMarkers />
      </div>

      {/* ===== LAYER 10 (z:50) — Smoke test panel ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <SmokeTestPanel />
      </div>

      {/* ===== LAYER 11 (z:60) — Command dashboard ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 60,
          pointerEvents: "none",
        }}
      >
        <CommandDashboard />
      </div>
    </div>
  );
}
