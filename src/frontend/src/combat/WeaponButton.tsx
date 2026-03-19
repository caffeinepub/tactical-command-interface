import type { Weapon } from "./useWeapons";
import { useWeaponsStore } from "./useWeapons";

export default function WeaponButton({ weapon }: { weapon: Weapon }) {
  const fire = useWeaponsStore((s) => s.fire);
  const ready = weapon.status === "READY";
  const cooldownPct = ready ? 0 : (1 - weapon.currentCooldown) * 100;

  return (
    <button
      type="button"
      onClick={() => fire(weapon.id)}
      disabled={!ready}
      style={{
        position: "relative",
        flex: 1,
        minWidth: "90px",
        minHeight: "72px",
        padding: "10px 8px 8px",
        background: ready ? "rgba(0,8,20,0.92)" : "rgba(0,4,12,0.88)",
        border: `1px solid ${ready ? weapon.color : "rgba(0,80,100,0.4)"}`,
        borderRadius: "3px",
        cursor: ready ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        boxShadow: ready
          ? `0 0 14px ${weapon.glowColor}, inset 0 0 10px rgba(0,20,40,0.5)`
          : "inset 0 0 8px rgba(0,0,0,0.6)",
        transition: "all 0.2s ease",
        outline: "none",
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: "9px",
          fontFamily: "monospace",
          letterSpacing: "0.18em",
          color: ready ? weapon.color : "rgba(0,150,180,0.4)",
          fontWeight: 700,
          textShadow: ready ? `0 0 8px ${weapon.color}` : "none",
          transition: "color 0.2s, text-shadow 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {weapon.name}
      </div>

      {/* Status badge */}
      <div
        style={{
          fontSize: "10px",
          fontFamily: "monospace",
          letterSpacing: "0.2em",
          fontWeight: 700,
          color: ready ? "#ffffff" : "rgba(0,100,140,0.7)",
          textShadow: ready
            ? `0 0 10px ${weapon.color}, 0 0 20px ${weapon.color}`
            : "none",
        }}
      >
        {ready ? "◉ FIRE" : "◌ COOL"}
      </div>

      {/* Cooldown bar */}
      <div
        style={{
          width: "100%",
          height: "3px",
          background: "rgba(0,40,60,0.8)",
          borderRadius: "2px",
          overflow: "hidden",
          border: "0.5px solid rgba(0,100,140,0.3)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: ready ? "100%" : `${cooldownPct}%`,
            background: ready
              ? `linear-gradient(90deg, ${weapon.color}88, ${weapon.color})`
              : "linear-gradient(90deg, rgba(0,100,140,0.6), rgba(0,150,180,0.8))",
            boxShadow: ready ? `0 0 6px ${weapon.color}` : "none",
            transition: "width 0.1s linear, background 0.3s",
          }}
        />
      </div>

      {/* Cooldown time label */}
      {!ready && (
        <div
          style={{
            fontSize: "8px",
            fontFamily: "monospace",
            color: "rgba(0,160,200,0.6)",
            letterSpacing: "0.1em",
          }}
        >
          {(weapon.currentCooldown * (weapon.cooldownTime / 1000)).toFixed(1)}s
        </div>
      )}

      {/* Active fire flash overlay */}
      {ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, ${weapon.color}08, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}
    </button>
  );
}
