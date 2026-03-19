import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import GlobeCore, { NODE_COUNT } from "./GlobeCore";
import HudOverlay from "./HudOverlay";
import SmokeTestPanel from "./SmokeTestPanel";
import CriticalAlertOverlay from "./alerts/CriticalAlertOverlay";
import CockpitAmbientFx from "./cockpit/CockpitAmbientFx";
import CockpitFrame from "./cockpit/CockpitFrame";
import SideEnclosure from "./cockpit/SideEnclosure";
import CombatEffectsLayer from "./combat/CombatEffectsLayer";
import WeaponControlDeck from "./combat/WeaponControlDeck";
import { useThreatStore } from "./combat/useThreatStore";
import { useWeaponsStore } from "./combat/useWeapons";
import { TUTORIAL_BONUS, useCreditsStore } from "./credits/useCreditsStore";
import CommandDashboard from "./dashboard/CommandDashboard";
import CoordinateDisplay from "./globe/CoordinateDisplay";
import { useOrientation } from "./hooks/useOrientation";
import AirHandlerIndicator from "./hud/AirHandlerIndicator";
import CockpitReticle from "./hud/CockpitReticle";
import ImpactParticleOverlay from "./hud/ImpactParticleOverlay";
import LeftPanel from "./hud/LeftPanel";
import RightPanel from "./hud/RightPanel";
import TargetLockAnim from "./hud/TargetLockAnim";
import VelocityIndicator from "./hud/VelocityIndicator";
import { useIntroStore } from "./intro/useIntroStore";
import ShipMotionLayer from "./motion/ShipMotionLayer";
import BottomCommandNav from "./portrait/BottomCommandNav";
import PortraitCommandDrawer from "./portrait/PortraitCommandDrawer";
import PortraitStatusBar from "./portrait/PortraitStatusBar";
import MobileJoystick from "./ship/MobileJoystick";
import RightDragZone from "./ship/RightDragZone";
import { useShipMovementSetup } from "./ship/useShipMovementSetup";
import { runSmokeTests } from "./smokeTest";
import SpaceLogPanel from "./story/SpaceLogPanel";
import StoryEventModal from "./story/StoryEventModal";
import { useAlertsEngine, useStoryEngine } from "./story/useStoryEngine";
import SubtitleStrip from "./subtitle/SubtitleStrip";
import TacticalLogPanel from "./tacticalLog/TacticalLogPanel";
import { useTacticalLogStore } from "./tacticalLog/useTacticalLogStore";
import CameraController from "./three/CameraController";
import GlobeHitPulse from "./three/GlobeHitPulse";
import InterceptSystem from "./three/InterceptSystem";
import SpaceBackground from "./three/SpaceBackground";
import ThreatManager from "./three/ThreatManager";
import TutorialOverlay from "./tutorial/TutorialOverlay";
import { useTutorialStore } from "./tutorial/useTutorialStore";
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

function HudControls() {
  const selectedNode = useTacticalStore((s) => s.selectedNode);
  const scanMode = useTacticalStore((s) => s.scanMode);
  const toggleScanMode = useTacticalStore((s) => s.toggleScanMode);
  const clearNode = useTacticalStore((s) => s.clearNode);
  const dashboardOpen = useDashboardStore((s) => s.dashboardOpen);
  const openDashboard = useDashboardStore((s) => s.openDashboard);

  const handleScan = () => {
    toggleScanMode();
    useTutorialStore.getState().setScanDetected();
  };

  const handleCmd = () => {
    openDashboard("command");
    useTutorialStore.getState().setPanelOpened();
  };

  return (
    <>
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
          data-tutorial-target="scan-btn"
          onClick={handleScan}
          style={compactBtnStyle(scanMode, "#00ffcc")}
        >
          {scanMode ? "\u25c9 SCAN" : "\u25ce SCAN"}
        </button>
        <button
          type="button"
          data-tutorial-target="cmd-btn"
          onClick={handleCmd}
          style={compactBtnStyle(dashboardOpen, "#00ccff")}
        >
          {dashboardOpen ? "\u2b21 SYS" : "\u2b21 CMD"}
        </button>
      </div>

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
          {selectedNode
            ? `\u25b8 LOCKED \u2014 ${selectedNode}`
            : "\u25b8 NO TARGET"}
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
        \u2261
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
      <GlobeHitPulse />
    </>
  );
}

function PortraitStage() {
  const handleGlobeAreaTap = useCallback((e: React.PointerEvent) => {
    const tutStep = useTutorialStore.getState().currentStep;
    if (tutStep !== "target") return;
    // DOM-level belt-and-suspenders: fires if Three.js onClick/onPointerUp did not register
    const store = useTacticalStore.getState();
    if (!store.globeTarget) {
      store.setGlobeTarget({
        lat: 20 + Math.random() * 20,
        lng: -10 + Math.random() * 20,
        sector: "ALPHA-7",
        id: `TGT-${Date.now()}`,
        threatLevel: 1,
      });
    }
    useTutorialStore.getState().setTargetDetected();
    e.stopPropagation();
  }, []);

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

      <div
        data-tutorial-target="globe-area"
        onPointerUp={handleGlobeAreaTap}
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
          <HudOverlay showThreatBanner={false} />
          <div
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <CoordinateDisplay />
          </div>
        </ShipMotionLayer>

        {/* Target lock animation — HUD layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            pointerEvents: "none",
          }}
        >
          <TargetLockAnim />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            pointerEvents: "none",
          }}
        >
          <CockpitReticle portrait />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            pointerEvents: "none",
          }}
        >
          <ImpactParticleOverlay />
        </div>

        <ShipMotionLayer
          factor={0.15}
          zIndex={12}
          style={{ pointerEvents: "none" }}
        >
          <CockpitAmbientFx />
        </ShipMotionLayer>

        <ShipMotionLayer
          factor={0.2}
          leanMult={1}
          zIndex={15}
          style={{ pointerEvents: "none" }}
        >
          <CockpitFrame />
        </ShipMotionLayer>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 20,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "flex-start",
          }}
        >
          <VelocityIndicator />
          <AirHandlerIndicator />
        </div>

        <RightDragZone />
      </div>

      <WeaponControlDeck portrait />
      <BottomCommandNav />
      <PortraitCommandDrawer />
      <TacticalLogPanel />
      <MobileJoystick />

      {/* Tutorial overlay */}
      <TutorialOverlay />

      {/* Story systems */}
      <StoryEventModal />
      <SpaceLogPanel />
      <CriticalAlertOverlay />

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

      <ShipMotionLayer
        factor={0.55}
        zIndex={10}
        style={{ pointerEvents: "none" }}
      >
        <HudOverlay showThreatBanner />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <CoordinateDisplay />
        </div>
      </ShipMotionLayer>

      {/* Target lock animation — HUD layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 11,
          pointerEvents: "none",
        }}
      >
        <TargetLockAnim />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 11,
          pointerEvents: "none",
        }}
      >
        <CockpitReticle />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 11,
          pointerEvents: "none",
        }}
      >
        <ImpactParticleOverlay />
      </div>

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

      {/* Globe area spotlight target */}
      <div
        data-tutorial-target="globe-area"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <LeftPanel />
      <RightPanel />

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

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 35,
          pointerEvents: "none",
        }}
      >
        <WeaponControlDeck portrait={false} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "clamp(70px, 10vh, 110px)",
          left: "clamp(14px, 2.5vw, 30px)",
          zIndex: 38,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          alignItems: "flex-start",
        }}
      >
        <VelocityIndicator />
        <AirHandlerIndicator />
      </div>

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

      <TacticalLogPanel />
      <RightDragZone />

      {/* Tutorial overlay */}
      <TutorialOverlay />

      {/* Story systems */}
      <StoryEventModal />
      <SpaceLogPanel />
      <CriticalAlertOverlay />
    </div>
  );
}

function useTutorialGating() {
  const pendingTutorialStart = useIntroStore((s) => s.pendingTutorialStart);
  const consumeTutorialStart = useIntroStore((s) => s.consumeTutorialStart);
  const tutorialComplete = useTutorialStore((s) => s.tutorialComplete);
  const startTutorial = useTutorialStore((s) => s.startTutorial);
  const gatedRef = useRef(false);

  useEffect(() => {
    if (!pendingTutorialStart || gatedRef.current) return;
    gatedRef.current = true;
    consumeTutorialStart();
    if (!tutorialComplete) {
      setTimeout(() => startTutorial(), 600);
    }
  }, [
    pendingTutorialStart,
    consumeTutorialStart,
    tutorialComplete,
    startTutorial,
  ]);
}

function useGlobeTapTutorial() {
  const selectedNode = useTacticalStore((s) => s.selectedNode);
  const prevNodeRef = useRef<string | null>(null);

  useEffect(() => {
    const prev = prevNodeRef.current;
    prevNodeRef.current = selectedNode;
    if (selectedNode && selectedNode !== prev) {
      useTutorialStore.getState().setTargetDetected();
    }
  }, [selectedNode]);
}

export default function TacticalStage() {
  const canvasMountedRef = useRef(false);
  const [, forceUpdate] = useState(0);
  const setSmokeResults = useTacticalStore((s) => s.setSmokeResults);
  const { isPortrait } = useOrientation();

  useShipMovementSetup();
  useTutorialGating();
  useGlobeTapTutorial();
  useStoryEngine();
  useAlertsEngine();

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

  // Award tutorial completion bonus credits (once)
  const tutorialCompleteForBonus = useTutorialStore((s) => s.tutorialComplete);
  const tutorialBonusFiredRef = useRef(false);
  useEffect(() => {
    if (tutorialCompleteForBonus && !tutorialBonusFiredRef.current) {
      tutorialBonusFiredRef.current = true;
      useCreditsStore.getState().earn(TUTORIAL_BONUS, "Tutorial Completed");
      useTacticalLogStore.getState().addEntry({
        type: "mission",
        message: `+${TUTORIAL_BONUS} CR — Tutorial Completed`,
      });
    }
  }, [tutorialCompleteForBonus]);

  return (
    <>
      {isPortrait ? <PortraitStage /> : <LandscapeStage />}
      <SubtitleStrip />
    </>
  );
}
