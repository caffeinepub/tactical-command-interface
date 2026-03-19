import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import GlobeCore, { NODE_COUNT } from "./GlobeCore";
import HudOverlay from "./HudOverlay";
import SmokeTestPanel from "./SmokeTestPanel";
import CockpitAmbientFx from "./cockpit/CockpitAmbientFx";
import CockpitFrame from "./cockpit/CockpitFrame";
import SideEnclosure from "./cockpit/SideEnclosure";
import CombatEffectsLayer from "./combat/CombatEffectsLayer";
import { useThreatStore } from "./combat/useThreatStore";
import { useWeaponsStore } from "./combat/useWeapons";
import CommandDashboard from "./dashboard/CommandDashboard";
import CoordinateDisplay from "./globe/CoordinateDisplay";
import { useOrientation } from "./hooks/useOrientation";
import LeftPanel from "./hud/LeftPanel";
import RightPanel from "./hud/RightPanel";
import ShipMotionLayer from "./motion/ShipMotionLayer";
import BottomCommandNav from "./portrait/BottomCommandNav";
import PortraitCommandDrawer from "./portrait/PortraitCommandDrawer";
import PortraitStatusBar from "./portrait/PortraitStatusBar";
import WeaponActionModule from "./portrait/WeaponActionModule";
import { runSmokeTests } from "./smokeTest";
import TacticalLogPanel from "./tacticalLog/TacticalLogPanel";
import { useTacticalLogStore } from "./tacticalLog/useTacticalLogStore";
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
    padding: "0 10px",
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
    minHeight: 44,
    minWidth: 52,
    whiteSpace: "nowrap" as const,
    pointerEvents: "auto" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}

/** Interactive HUD controls — landscape top bar */
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
              minHeight: 28,
            }}
          >
            CLR
          </button>
        )}
      </div>
    </>
  );
}

/** Floating LOG button — right side, landscape only */
function FloatingLogButton() {
  const logPanelOpen = useTacticalLogStore((s) => s.panelOpen);
  const toggleLogPanel = useTacticalLogStore((s) => s.togglePanel);

  return (
    <button
      type="button"
      onClick={toggleLogPanel}
      style={{
        position: "absolute",
        right: "clamp(10px, 1.8vw, 22px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 42,
        pointerEvents: "auto",
        background: logPanelOpen ? "rgba(0,50,70,0.95)" : "rgba(0,8,20,0.88)",
        border: `1px solid ${
          logPanelOpen ? "rgba(0,255,200,0.5)" : "rgba(0,200,255,0.22)"
        }`,
        borderRadius: 4,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "10px 7px",
        boxShadow: logPanelOpen ? "0 0 14px rgba(0,255,200,0.25)" : "none",
        backdropFilter: "blur(8px)",
        outline: "none",
        transition: "all 0.2s ease",
        minWidth: 38,
        minHeight: 56,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: logPanelOpen ? "#00ffcc" : "rgba(0,200,255,0.6)",
          lineHeight: 1,
        }}
      >
        ≡
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 6,
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: logPanelOpen ? "#00ffcc" : "rgba(0,180,255,0.5)",
          lineHeight: 1,
          writingMode: "vertical-rl" as const,
          textOrientation: "mixed" as const,
        }}
      >
        LOG
      </span>
    </button>
  );
}

/** Three.js scene children — shared */
function SceneChildren() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[5, 2, 3]} intensity={2.8} color="#fff5e0" />
      <pointLight position={[-4, -1, -2]} intensity={0.35} color="#1a3fff" />
      <SpaceBackground />
      <CameraController />
      <GlobeCore />
      <CombatEffectsLayer />
      <ThreatManager />
      <InterceptSystem />
    </>
  );
}

/** Portrait layout */
function PortraitStage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000008",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PortraitStatusBar />

      {/* Globe area */}
      <div
        style={{
          position: "relative",
          height: "42dvh",
          width: "100%",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
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
            <SceneChildren />
          </Canvas>
        </ShipMotionLayer>

        <ShipMotionLayer
          factor={0.55}
          zIndex={10}
          style={{ pointerEvents: "none" }}
        >
          <HudOverlay />
          <div
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <CoordinateDisplay />
          </div>
        </ShipMotionLayer>

        <ShipMotionLayer
          factor={0.15}
          zIndex={12}
          style={{ pointerEvents: "none" }}
        >
          <CockpitAmbientFx />
        </ShipMotionLayer>

        <ShipMotionLayer
          factor={0.2}
          zIndex={15}
          style={{ pointerEvents: "none" }}
        >
          <CockpitFrame />
        </ShipMotionLayer>
      </div>

      {/* Weapon action module (portrait — tap slots to fire) */}
      <WeaponActionModule />

      {/* Bottom nav */}
      <BottomCommandNav />

      {/* Portrait drawer */}
      <PortraitCommandDrawer />

      {/* Tactical log panel — shared */}
      <TacticalLogPanel />

      {/* QA overlays */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <SmokeTestPanel />
      </div>
    </div>
  );
}

/** Landscape layout */
function LandscapeStage() {
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
      {/* LAYER 1 — Globe canvas */}
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
          <SceneChildren />
        </Canvas>
      </ShipMotionLayer>

      {/* LAYER 2 — Side enclosure */}
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

      {/* LAYER 3 — HUD */}
      <ShipMotionLayer
        factor={0.55}
        zIndex={10}
        style={{ pointerEvents: "none" }}
      >
        <HudOverlay />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <CoordinateDisplay />
        </div>
      </ShipMotionLayer>

      {/* LAYER 4 — Cockpit ambient FX */}
      <ShipMotionLayer
        factor={0.15}
        zIndex={12}
        style={{ pointerEvents: "none" }}
      >
        <CockpitAmbientFx />
      </ShipMotionLayer>

      {/* LAYER 5 — Cockpit frame image */}
      <ShipMotionLayer
        factor={0.2}
        zIndex={15}
        style={{ pointerEvents: "none" }}
      >
        <CockpitFrame />
      </ShipMotionLayer>

      {/* LAYER 6 — Left + Right glass panels */}
      <LeftPanel />
      <RightPanel />

      {/* LAYER 7 — HUD controls */}
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

      {/* LAYER 8 — Floating LOG button */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 42,
          pointerEvents: "none",
        }}
      >
        <FloatingLogButton />
      </div>

      {/* LAYER 9 — Smoke test panel */}
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

      {/* LAYER 10 — Command dashboard */}
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

      {/* Tactical log panel — fixed, above all */}
      <TacticalLogPanel />
    </div>
  );
}

export default function TacticalStage() {
  const canvasMountedRef = useRef(false);
  const [, forceUpdate] = useState(0);
  const setSmokeResults = useTacticalStore((s) => s.setSmokeResults);
  const { isPortrait } = useOrientation();

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

  return isPortrait ? <PortraitStage /> : <LandscapeStage />;
}
