import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import GlobeCore, { NODE_COUNT } from "./GlobeCore";
import HudOverlay from "./HudOverlay";
import SmokeTestPanel from "./SmokeTestPanel";
import CockpitAmbientFx from "./cockpit/CockpitAmbientFx";
import CockpitFrame from "./cockpit/CockpitFrame";
import CombatEffectsLayer from "./combat/CombatEffectsLayer";
import WeaponDeck from "./combat/WeaponDeck";
import CommandDashboard from "./dashboard/CommandDashboard";
import CoordinateDisplay from "./globe/CoordinateDisplay";
import { runSmokeTests } from "./smokeTest";
import CameraController from "./three/CameraController";
import InterceptSystem from "./three/InterceptSystem";
import SpaceBackground from "./three/SpaceBackground";
import ThreatManager from "./three/ThreatManager";
import { useTacticalStore } from "./useTacticalStore";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSmokeResults]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
      }}
      className="tactical-stage"
    >
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
          intensity={1.8}
          color="#fff5e0"
        />
        <pointLight position={[-4, -1, -2]} intensity={0.35} color="#1a3fff" />
        <SpaceBackground />
        <CameraController />
        <GlobeCore />
        <CombatEffectsLayer />
        <ThreatManager />
        <InterceptSystem />
      </Canvas>
      <HudOverlay />
      <CoordinateDisplay />
      <WeaponDeck />
      <CockpitFrame />
      <CockpitAmbientFx />
      <SmokeTestPanel />
      <CommandDashboard />
    </div>
  );
}
