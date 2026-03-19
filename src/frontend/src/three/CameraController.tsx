import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useCombatState } from "../combat/useCombatState";
import { useGlobeControls } from "../hooks/useGlobeControls";

// Singleton controls instance shared via module scope
let globeControls: ReturnType<typeof useGlobeControls> | null = null;

export function getGlobeControls() {
  return globeControls;
}

export default function CameraController() {
  const controls = useGlobeControls();
  const { camera } = useThree();

  // Store in module scope so other components can access
  useEffect(() => {
    globeControls = controls;
    return () => {
      globeControls = null;
    };
  });

  useFrame(() => {
    const { azimuth, elevation, radius } = controls;
    const x = radius * Math.cos(elevation) * Math.sin(azimuth);
    const y = radius * Math.sin(elevation);
    const z = radius * Math.cos(elevation) * Math.cos(azimuth);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    // Apply camera shake as additive offset
    const shake = useCombatState.getState().cameraShake;
    if (shake) {
      const elapsed = (performance.now() - shake.startTime) / shake.duration;
      if (elapsed < 1) {
        const decay = (1 - elapsed) ** 2;
        camera.position.x += Math.sin(elapsed * 47) * shake.intensity * decay;
        camera.position.y +=
          Math.cos(elapsed * 31) * shake.intensity * decay * 0.6;
      } else {
        useCombatState.getState().setCameraShake(null);
      }
    }
  });

  return null;
}
