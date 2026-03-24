/**
 * EngineeringPanel — V17.2
 * Added: AudioStatusHud section + WarModeToggle section.
 */
import { memo } from "react";
import WarModeToggle from "../../combat/WarModeToggle";
import { useTestModeStore } from "../../combat/useTestModeStore";
import AudioStatusHud from "../../hud/AudioStatusHud";

interface SystemPower {
  name: string;
  value: number;
  color: string;
}

const SYSTEMS: SystemPower[] = [
  { name: "WEAPONS", value: 72, color: "#ff6644" },
  { name: "SHIELDS", value: 58, color: "#00e8ff" },
  { name: "ENGINES", value: 84, color: "#00ff88" },
  { name: "SENSORS", value: 91, color: "#8080ff" },
  { name: "LIFE SUPPORT", value: 100, color: "#44ffcc" },
];

const EngineeringPanel = memo(function EngineeringPanel() {
  const warEnabled = useTestModeStore((s) => s.warEnabled);

  return (
    <div style={{ padding: "14px 14px" }}>
      {/* ── TEST MODE SECTION ────────────────────────────────── */}
      <div
        style={{
          marginBottom: 16,
          padding: "10px 12px",
          border: `1px solid ${warEnabled ? "rgba(255,68,68,0.3)" : "rgba(0,255,200,0.3)"}`,
          background: warEnabled ? "rgba(30,0,0,0.4)" : "rgba(0,20,15,0.4)",
          borderRadius: 3,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: 8,
          }}
        >
          ▸ COMBAT MODE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <WarModeToggle />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: warEnabled
                ? "rgba(255,100,100,0.7)"
                : "rgba(0,255,180,0.7)",
              letterSpacing: "0.1em",
              lineHeight: 1.4,
            }}
          >
            {warEnabled
              ? "Hostile spawns ACTIVE\u2009— threats escalating"
              : "War suppressed\u2009— safe for testing"}
          </span>
        </div>
      </div>

      {/* ── POWER DISTRIBUTION ────────────────────────────── */}
      <div
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 12,
          borderBottom: "1px solid rgba(0,220,255,0.1)",
          paddingBottom: 4,
        }}
      >
        ▸ POWER DISTRIBUTION
      </div>

      {SYSTEMS.map((sys) => (
        <div key={sys.name} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 10,
              marginBottom: 3,
            }}
          >
            <span
              style={{ color: "rgba(0,220,255,0.7)", letterSpacing: "0.1em" }}
            >
              {sys.name}
            </span>
            <span style={{ color: sys.color, fontWeight: 700 }}>
              {sys.value}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(0,100,150,0.25)",
              border: "0.5px solid rgba(0,220,255,0.12)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${sys.value}%`,
                background: `linear-gradient(90deg, ${sys.color}55, ${sys.color})`,
                boxShadow: `0 0 6px ${sys.color}66`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      ))}

      {/* ── AUDIO STATUS ──────────────────────────────────── */}
      <div
        style={{
          marginTop: 14,
          borderTop: "1px solid rgba(0,220,255,0.1)",
          paddingTop: 12,
        }}
      >
        <AudioStatusHud />
      </div>
    </div>
  );
});

export default EngineeringPanel;
