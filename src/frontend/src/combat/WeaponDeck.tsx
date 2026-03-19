import { useTacticalStore } from "../useTacticalStore";
import WeaponButton from "./WeaponButton";
import { useCombatState } from "./useCombatState";
import { useWeaponsStore } from "./useWeapons";

export default function WeaponDeck() {
  const selectedNode = useTacticalStore((s) => s.selectedNode);
  const weapons = useWeaponsStore((s) => s.weapons);
  const screenFlash = useCombatState((s) => s.screenFlash);
  const firingEffect = useCombatState((s) => s.firingEffect);
  const empStunnedNode = useCombatState((s) => s.empStunnedNode);
  const shieldHit = useCombatState((s) => s.shieldHit);

  const visible = !!selectedNode;

  const flashColor =
    firingEffect?.type === "emp"
      ? "rgba(255,120,0,0.10)"
      : firingEffect?.type === "railgun"
        ? "rgba(80,160,255,0.12)"
        : "rgba(0,255,180,0.08)";

  return (
    <>
      {screenFlash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: flashColor,
            pointerEvents: "none",
            zIndex: 26,
            animation: "weaponFlash 0.12s ease-out forwards",
          }}
        />
      )}
      {shieldHit && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,60,0,0.07)",
            pointerEvents: "none",
            zIndex: 27,
            animation: "shieldFlash 0.4s ease-out forwards",
          }}
        />
      )}
      {empStunnedNode && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,80,0,0.03)",
            pointerEvents: "none",
            zIndex: 26,
            animation: "empFlicker 3s ease-out forwards",
          }}
        />
      )}

      {/* No-target hint */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(7%, 9vh, 11%)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          pointerEvents: "none",
          fontFamily: "monospace",
          fontSize: 8,
          letterSpacing: "0.22em",
          color: "rgba(0,180,255,0.28)",
          textAlign: "center",
          whiteSpace: "nowrap",
          opacity: visible ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      >
        SELECT TARGET TO ENGAGE
      </div>

      {/* Weapon deck — docked into lower console */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(6%, 8vh, 10%)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 25,
          pointerEvents: visible ? "auto" : "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Lock label */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 5,
            fontFamily: "monospace",
            fontSize: 8,
            letterSpacing: "0.22em",
            color: empStunnedNode ? "#ff8800" : "rgba(0,200,255,0.6)",
            textShadow: empStunnedNode
              ? "0 0 6px #ff8800"
              : "0 0 6px rgba(0,200,255,0.3)",
            animation: empStunnedNode
              ? "empBlink 0.4s ease-in-out infinite"
              : "none",
          }}
        >
          {empStunnedNode
            ? `▸ ${selectedNode} — EMP STUNNED`
            : `▸ LOCKED — ${selectedNode ?? ""}`}
        </div>

        {/* Weapon buttons row */}
        <div style={{ display: "flex", gap: 5, alignItems: "stretch" }}>
          {weapons.map((weapon) => (
            <WeaponButton key={weapon.id} weapon={weapon} />
          ))}
        </div>

        {/* Bottom accent */}
        <div
          style={{
            marginTop: 4,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,200,255,0.35), rgba(0,200,255,0.35), transparent)",
          }}
        />
      </div>

      <style>{`
        @keyframes weaponFlash { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes empFlicker { 0%,100%{opacity:1}10%{opacity:0.3}20%{opacity:0.9}30%{opacity:0.2}40%{opacity:0.8}60%{opacity:0.5}80%{opacity:0.2} }
        @keyframes empBlink { 0%,100%{opacity:1}50%{opacity:0.3} }
        @keyframes shieldFlash { 0%{opacity:1}30%{opacity:0.6}100%{opacity:0} }
        @keyframes engagedPulse { from{border-color:var(--wc,#00ffcc)}to{border-color:transparent} }
        @keyframes engagedGlow { from{opacity:0.6}to{opacity:1} }
      `}</style>
    </>
  );
}
