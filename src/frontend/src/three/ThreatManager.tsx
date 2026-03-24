/**
 * ThreatManager — V17.2
 * Checks useTestModeStore.warEnabled before spawning threats.
 * When TEST MODE is active (warEnabled=false), no new threats spawn.
 * Existing threats still animate out (not frozen mid-flight).
 */
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useTestModeStore } from "../combat/useTestModeStore";
import { useThreatStore } from "../combat/useThreatStore";
import AsteroidThreat from "./AsteroidThreat";

function ThreatUpdater() {
  const updateThreats = useThreatStore((s) => s.updateThreats);
  const removeDestroyedThreats = useThreatStore(
    (s) => s.removeDestroyedThreats,
  );

  useFrame((_, delta) => {
    updateThreats(delta);
    removeDestroyedThreats();
  });

  return null;
}

export default function ThreatManager() {
  const threats = useThreatStore((s) => s.threats);
  const spawnThreat = useThreatStore((s) => s.spawnThreat);
  const warEnabled = useTestModeStore((s) => s.warEnabled);
  const warRef = useRef(warEnabled);

  // Keep ref in sync so the timeout callbacks read the latest value
  useEffect(() => {
    warRef.current = warEnabled;
  }, [warEnabled]);

  useEffect(() => {
    // Initial threat after delay (only if war is on)
    const initial = setTimeout(() => {
      if (warRef.current) spawnThreat();
    }, 4000);

    function scheduleNext(): ReturnType<typeof setTimeout> {
      const delay = 12000 + Math.random() * 6000;
      return setTimeout(() => {
        if (warRef.current) spawnThreat();
        timer = scheduleNext();
      }, delay);
    }

    let timer = scheduleNext();

    return () => {
      clearTimeout(initial);
      clearTimeout(timer);
    };
  }, [spawnThreat]);

  return (
    <>
      <ThreatUpdater />
      {threats.map((threat) => (
        <AsteroidThreat key={threat.id} threat={threat} />
      ))}
    </>
  );
}
