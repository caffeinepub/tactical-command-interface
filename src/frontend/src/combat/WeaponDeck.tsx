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

  // Pick flash color from active weapon
  const flashColor =
    firingEffect?.type === "emp"
      ? "rgba(255,120,0,0.12)"
      : firingEffect?.type === "railgun"
        ? "rgba(80,160,255,0.15)"
        : "rgba(0,255,180,0.10)";

  return (
    <>
      {/* Screen flash on fire */}
      {screenFlash && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: flashColor,
            pointerEvents: "none",
            zIndex: 50,
            animation: "weaponFlash 0.12s ease-out forwards",
          }}
        />
      )}

      {/* Shield hit flash */}
      {shieldHit && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,60,0,0.08)",
            pointerEvents: "none",
            zIndex: 51,
            animation: "shieldFlash 0.4s ease-out forwards",
          }}
        />
      )}

      {/* EMP stun overlay */}
      {empStunnedNode && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,80,0,0.04)",
            pointerEvents: "none",
            zIndex: 49,
            animation: "empFlicker 3s ease-out forwards",
          }}
        />
      )}

      {/* Heat distortion near weapon deck */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 80,
          backdropFilter: firingEffect ? "blur(1.5px)" : "none",
          opacity: firingEffect ? 0.4 : 0,
          transition: "opacity 0.05s ease-out",
          animation: firingEffect ? "heatFade 0.2s ease-out forwards" : "none",
          pointerEvents: "none",
          zIndex: 48,
          borderRadius: "50% 50% 0 0",
        }}
      />

      {/* Weapon deck panel */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(70px, 11vw, 110px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          pointerEvents: visible ? "auto" : "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease, transform 0.35s ease",
          transformOrigin: "bottom center",
        }}
      >
        {/* Target lock indicator */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "8px",
            fontFamily: "monospace",
            fontSize: "9px",
            letterSpacing: "0.25em",
            color: empStunnedNode ? "#ff8800" : "rgba(0,220,255,0.7)",
            textShadow: empStunnedNode
              ? "0 0 8px #ff8800"
              : "0 0 8px rgba(0,200,255,0.5)",
            animation: empStunnedNode
              ? "empBlink 0.4s ease-in-out infinite"
              : "none",
          }}
        >
          {empStunnedNode
            ? `▸ ${selectedNode} — EMP STUNNED`
            : `▸ TARGET LOCKED — ${selectedNode ?? ""}`}
        </div>

        {/* Weapon buttons row */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "stretch",
          }}
        >
          {weapons.map((weapon) => (
            <WeaponButton key={weapon.id} weapon={weapon} />
          ))}
        </div>

        {/* Bottom frame accent line */}
        <div
          style={{
            marginTop: "6px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(0,220,255,0.4), rgba(0,220,255,0.4), transparent)",
          }}
        />
      </div>

      <style>{`
        @keyframes weaponFlash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes empFlicker {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.3; }
          20% { opacity: 0.9; }
          30% { opacity: 0.2; }
          40% { opacity: 0.8; }
          60% { opacity: 0.5; }
          80% { opacity: 0.2; }
        }
        @keyframes empBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes heatFade {
          from { opacity: 0.4; filter: blur(1.5px); }
          to   { opacity: 0;   filter: blur(0); }
        }
        @keyframes shieldFlash {
          0%   { opacity: 1; }
          30%  { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
