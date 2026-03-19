import { useDashboardStore } from "./useDashboardStore";
import { useTacticalStore } from "./useTacticalStore";

function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ marginBottom: "clamp(3px, 0.8vw, 8px)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "clamp(8px, 1.1vw, 11px)",
          fontFamily: "monospace",
          color: "rgba(0,220,255,0.75)",
          marginBottom: "2px",
          letterSpacing: "0.1em",
        }}
      >
        <span>{label}</span>
        <span style={{ color }}>{value.toString().padStart(3, "0")}</span>
      </div>
      <div
        style={{
          height: "clamp(2px, 0.4vw, 4px)",
          background: "rgba(0,100,150,0.3)",
          borderRadius: "1px",
          overflow: "hidden",
          border: "0.5px solid rgba(0,220,255,0.2)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}`,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function HudReadout() {
  const { selectedNode, nodeData, scanMode, toggleScanMode } =
    useTacticalStore();
  const { dashboardOpen, openDashboard } = useDashboardStore();

  return (
    <div
      data-hud
      style={{
        position: "absolute",
        bottom: "clamp(12px, 3vw, 32px)",
        left: "clamp(10px, 2.5vw, 40px)",
        width: "clamp(160px, 22vw, 260px)",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {/* TARGET READOUT */}
      <div
        style={{
          marginBottom: "clamp(6px, 1vw, 12px)",
          padding: "clamp(6px, 1.2vw, 12px) clamp(8px, 1.5vw, 16px)",
          border: "1px solid rgba(0,220,255,0.35)",
          background: "rgba(0,10,30,0.75)",
          backdropFilter: "blur(4px)",
          boxShadow:
            "0 0 12px rgba(0,180,255,0.15), inset 0 0 20px rgba(0,80,120,0.1)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(7px, 0.9vw, 9px)",
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: "4px",
          }}
        >
          ▸ TARGET LOCK
        </div>
        <div
          style={{
            fontSize: "clamp(10px, 1.4vw, 14px)",
            fontFamily: "monospace",
            color: selectedNode ? "#00ffcc" : "rgba(0,220,255,0.4)",
            letterSpacing: "0.12em",
            fontWeight: 600,
            textShadow: selectedNode ? "0 0 8px #00ffcc" : "none",
            transition: "color 0.3s, text-shadow 0.3s",
          }}
        >
          {selectedNode ?? "— NO TARGET —"}
        </div>
      </div>

      {/* STATS — only when a node is selected */}
      {nodeData && (
        <div
          style={{
            padding: "clamp(6px, 1.2vw, 12px) clamp(8px, 1.5vw, 16px)",
            border: "1px solid rgba(0,220,255,0.25)",
            background: "rgba(0,10,30,0.7)",
            backdropFilter: "blur(4px)",
            boxShadow:
              "0 0 12px rgba(0,180,255,0.1), inset 0 0 20px rgba(0,80,120,0.08)",
            marginBottom: "clamp(6px, 1vw, 12px)",
          }}
        >
          <div
            style={{
              fontSize: "clamp(7px, 0.85vw, 9px)",
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.2em",
              marginBottom: "clamp(4px, 0.8vw, 8px)",
            }}
          >
            ▸ SIGNAL ANALYSIS
          </div>
          <StatBar label="ENERGY" value={nodeData.energy} color="#00ccff" />
          <StatBar label="SIGNAL" value={nodeData.signal} color="#40ffcc" />
          <StatBar
            label="STABILITY"
            value={nodeData.stability}
            color="#8080ff"
          />
        </div>
      )}

      {/* SCAN MODE TOGGLE */}
      <button
        type="button"
        data-ocid="hud.toggle"
        onClick={toggleScanMode}
        style={{
          pointerEvents: "auto",
          display: "block",
          width: "100%",
          padding: "clamp(6px, 1vw, 10px) clamp(8px, 1.5vw, 14px)",
          fontFamily: "monospace",
          fontSize: "clamp(9px, 1.1vw, 11px)",
          letterSpacing: "0.2em",
          fontWeight: 700,
          color: scanMode ? "#00ffcc" : "rgba(0,200,255,0.8)",
          background: scanMode ? "rgba(0,60,80,0.85)" : "rgba(0,10,30,0.8)",
          border: `1px solid ${
            scanMode ? "rgba(0,255,200,0.6)" : "rgba(0,220,255,0.4)"
          }`,
          cursor: "pointer",
          textAlign: "left" as const,
          boxShadow: scanMode
            ? "0 0 16px rgba(0,255,200,0.3), inset 0 0 12px rgba(0,120,100,0.2)"
            : "0 0 8px rgba(0,180,255,0.1)",
          transition: "all 0.25s ease",
          backdropFilter: "blur(4px)",
          minHeight: "44px",
          marginBottom: "clamp(4px, 0.8vw, 8px)",
        }}
      >
        {scanMode ? "◉ SCAN ACTIVE" : "◎ SCAN MODE"}
      </button>

      {/* COMMAND BUTTON */}
      <button
        type="button"
        data-ocid="hud.command.button"
        onClick={() => openDashboard("command")}
        style={{
          pointerEvents: "auto",
          display: "block",
          width: "100%",
          padding: "clamp(6px, 1vw, 10px) clamp(8px, 1.5vw, 14px)",
          fontFamily: "monospace",
          fontSize: "clamp(9px, 1.1vw, 11px)",
          letterSpacing: "0.2em",
          fontWeight: 700,
          color: dashboardOpen ? "#00ffcc" : "rgba(0,200,255,0.8)",
          background: dashboardOpen
            ? "rgba(0,60,80,0.85)"
            : "rgba(0,10,30,0.8)",
          border: `1px solid ${
            dashboardOpen ? "rgba(0,255,200,0.6)" : "rgba(0,220,255,0.4)"
          }`,
          cursor: "pointer",
          textAlign: "left" as const,
          boxShadow: dashboardOpen
            ? "0 0 16px rgba(0,255,200,0.3), inset 0 0 12px rgba(0,120,100,0.2)"
            : "0 0 8px rgba(0,180,255,0.1)",
          transition: "all 0.25s ease",
          backdropFilter: "blur(4px)",
          minHeight: "44px",
        }}
      >
        {dashboardOpen ? "⬡ SYSTEMS OPEN" : "⬡ COMMAND"}
      </button>
    </div>
  );
}
