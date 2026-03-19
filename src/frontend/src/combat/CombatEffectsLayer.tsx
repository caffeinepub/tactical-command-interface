import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NODE_IDS, NODE_POSITIONS, latLngToVec3 } from "../GlobeCore";
import DestructionEffects from "./DestructionEffects";
import { EMPImpact, PulseImpact, RailImpact } from "./ImpactEffects";
import {
  EMPWave,
  MissileTracer,
  PulseBolt,
  RailSlug,
} from "./ProjectileSystem";
import { useCombatState } from "./useCombatState";
import { useWeaponsStore } from "./useWeapons";

function getTargetPos(nodeId: string): THREE.Vector3 | null {
  const idx = NODE_IDS.indexOf(nodeId);
  if (idx < 0) return null;
  const [lat, lng] = NODE_POSITIONS[idx];
  const [x, y, z] = latLngToVec3(lat, lng, 1.53);
  return new THREE.Vector3(x, y, z);
}

export default function CombatEffectsLayer() {
  const firingEffect = useCombatState((s) => s.firingEffect);
  const tick = useWeaponsStore((s) => s.tick);

  useFrame((_, delta) => {
    tick(delta * 1000);
  });

  const targetPos = firingEffect ? getTargetPos(firingEffect.targetId) : null;

  const elapsed = firingEffect
    ? Math.min(
        1,
        (performance.now() - firingEffect.startTime) / firingEffect.duration,
      )
    : 0;

  return (
    <group>
      <DestructionEffects />

      {firingEffect && targetPos && (
        <>
          {firingEffect.type === "pulse" && (
            <PulseBolt targetPos={targetPos} progress={elapsed} />
          )}
          {firingEffect.type === "railgun" && (
            <RailSlug targetPos={targetPos} progress={elapsed} />
          )}
          {firingEffect.type === "emp" && (
            <EMPWave targetPos={targetPos} progress={elapsed} />
          )}
          {firingEffect.type === "missile" && (
            <MissileTracer targetPos={targetPos} progress={elapsed} />
          )}

          {elapsed >= 0.75 && (
            <>
              {firingEffect.type === "pulse" && (
                <PulseImpact targetPos={targetPos} progress={elapsed} />
              )}
              {firingEffect.type === "railgun" && (
                <RailImpact targetPos={targetPos} progress={elapsed} />
              )}
              {firingEffect.type === "emp" && (
                <EMPImpact targetPos={targetPos} progress={elapsed} />
              )}
              {firingEffect.type === "missile" && (
                <PulseImpact targetPos={targetPos} progress={elapsed} />
              )}
            </>
          )}
        </>
      )}
    </group>
  );
}
