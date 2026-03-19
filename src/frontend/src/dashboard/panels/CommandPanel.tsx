import { memo } from "react";
import { useDashboardStore } from "../../useDashboardStore";

function StatusDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 5px ${color}`,
        flexShrink: 0,
      }}
    />
  );
}

function StatRow({
  label,
  value,
  pct,
  color,
}: { label: string; value: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 10,
          marginBottom: 3,
        }}
      >
        <span style={{ color: "rgba(0,180,255,0.5)", letterSpacing: "0.12em" }}>
          {label}
        </span>
        <span style={{ color }}>{value}</span>
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(0,100,150,0.3)",
          border: "0.5px solid rgba(0,220,255,0.15)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 6px ${color}`,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

const SYSTEMS = [
  { label: "WEAPONS", status: "ONLINE", color: "#00ff88" },
  { label: "SHIELDS", status: "REDUCED", color: "#ffaa00" },
  { label: "DRIVES", status: "NOMINAL", color: "#00ff88" },
  { label: "COMMS", status: "ACTIVE", color: "#00e8ff" },
];

const CommandPanel = memo(function CommandPanel() {
  const { shipStatus } = useDashboardStore();

  return (
    <div style={{ padding: "14px 14px" }}>
      {/* Mission Block */}
      <div
        style={{
          padding: "10px 12px",
          border: "1px solid rgba(0,255,200,0.35)",
          background: "rgba(0,20,40,0.6)",
          boxShadow: "0 0 14px rgba(0,255,200,0.1)",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: 4,
          }}
        >
          ▸ PRIMARY OBJECTIVE
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            color: "#00ffcc",
            letterSpacing: "0.12em",
            fontWeight: 700,
            textShadow: "0 0 8px #00ffcc",
            marginBottom: 6,
          }}
        >
          OBJECTIVE DELTA-9 — SECURE PERIMETER
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.12em",
            }}
          >
            TYPE: <span style={{ color: "rgba(0,220,255,0.8)" }}>RECON</span>
          </span>
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.12em",
            }}
          >
            THREAT: <span style={{ color: "#ffaa00" }}>ELEVATED</span>
          </span>
        </div>
      </div>

      {/* Ship Status */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: 8,
            borderBottom: "1px solid rgba(0,220,255,0.1)",
            paddingBottom: 4,
          }}
        >
          ▸ SHIP STATUS
        </div>
        <StatRow
          label="HULL INTEGRITY"
          value={`${shipStatus.hull}%`}
          pct={shipStatus.hull}
          color={shipStatus.hull > 60 ? "#00ff88" : "#ffaa00"}
        />
        <StatRow
          label="SHIELD LEVEL"
          value={`${shipStatus.shields}%`}
          pct={shipStatus.shields}
          color="#00e8ff"
        />
        <StatRow
          label="POWER OUTPUT"
          value={`${shipStatus.power}%`}
          pct={shipStatus.power}
          color="#8080ff"
        />
        <StatRow
          label="VELOCITY"
          value={`${shipStatus.speed.toFixed(2)}c`}
          pct={shipStatus.speed * 100}
          color="rgba(0,220,255,0.8)"
        />
      </div>

      {/* Systems */}
      <div>
        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: 8,
            borderBottom: "1px solid rgba(0,220,255,0.1)",
            paddingBottom: 4,
          }}
        >
          ▸ SYSTEM STATUS
        </div>
        {SYSTEMS.map((sys) => (
          <div
            key={sys.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 0",
              borderBottom: "1px solid rgba(0,220,255,0.06)",
            }}
          >
            <StatusDot color={sys.color} />
            <span
              style={{
                flex: 1,
                fontFamily: "monospace",
                fontSize: 10,
                color: "rgba(0,220,255,0.8)",
                letterSpacing: "0.12em",
              }}
            >
              {sys.label}
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: sys.color,
                letterSpacing: "0.1em",
              }}
            >
              {sys.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CommandPanel;
