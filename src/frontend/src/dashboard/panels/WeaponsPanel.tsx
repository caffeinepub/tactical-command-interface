import { memo } from "react";

interface Weapon {
  name: string;
  status: "READY" | "COOLING" | "OFFLINE";
  cooldown: number;
}

const WEAPONS: Weapon[] = [
  { name: "PLASMA CANNON MK-II", status: "READY", cooldown: 100 },
  { name: "RAIL GUN ARRAY", status: "READY", cooldown: 100 },
  { name: "MISSILE BATTERY", status: "COOLING", cooldown: 60 },
  { name: "EMP BURST", status: "OFFLINE", cooldown: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  READY: "#00ff88",
  COOLING: "#ffaa00",
  OFFLINE: "#ff3344",
};

const WeaponsPanel = memo(function WeaponsPanel() {
  return (
    <div style={{ padding: "14px 14px" }}>
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
        ▸ WEAPONS LOADOUT
      </div>
      {WEAPONS.map((w, i) => {
        const color = STATUS_COLORS[w.status];
        return (
          <div
            key={w.name}
            data-ocid={`weapons.item.${i + 1}`}
            style={{
              padding: "10px 12px",
              border: `1px solid ${w.status === "READY" ? "rgba(0,220,255,0.2)" : w.status === "COOLING" ? "rgba(255,170,0,0.2)" : "rgba(255,50,50,0.2)"}`,
              background: "rgba(0,10,25,0.6)",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(0,220,255,0.9)",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                {w.name}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  color,
                  letterSpacing: "0.12em",
                  textShadow: `0 0 6px ${color}`,
                }}
              >
                {w.status}
              </span>
            </div>
            <div
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.4)",
                marginBottom: 5,
                letterSpacing: "0.1em",
              }}
            >
              COOLDOWN
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(0,100,150,0.3)",
                border: "0.5px solid rgba(0,220,255,0.15)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${w.cooldown}%`,
                  background: `linear-gradient(90deg, ${color}66, ${color})`,
                  boxShadow: `0 0 8px ${color}88`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default WeaponsPanel;
