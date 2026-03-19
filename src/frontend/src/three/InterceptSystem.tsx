import { useEffect } from "react";
import { useCombatState } from "../combat/useCombatState";
import { useThreatStore } from "../combat/useThreatStore";

export default function InterceptSystem() {
  const firingEffect = useCombatState((s) => s.firingEffect);

  useEffect(() => {
    if (!firingEffect) return;
    if (!firingEffect.targetId.startsWith("THREAT-")) return;

    const { interceptThreat } = useThreatStore.getState();
    interceptThreat(firingEffect.targetId, firingEffect.type);
  }, [firingEffect]);

  return null;
}
