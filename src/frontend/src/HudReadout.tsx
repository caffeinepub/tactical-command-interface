import { useDashboardStore } from "./useDashboardStore";
import { useTacticalStore } from "./useTacticalStore";

export default function HudReadout() {
  const { selectedNode, scanMode, toggleScanMode } = useTacticalStore();
  const { dashboardOpen, openDashboard } = useDashboardStore();

  return (
    <>
      {/* ── Compact top-right control strip ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(8px, 1.8vh, 18px)",
          right: "clamp(10px, 2.5vw, 36px)",
          zIndex: 20,
          display: "flex",
          gap: 6,
          pointerEvents: "auto",
        }}
      >
        <button
          type="button"
          data-ocid="hud.toggle"
          onClick={toggleScanMode}
          style={compactBtnStyle(scanMode, "#00ffcc")}
          title="Scan Mode"
        >
          {scanMode ? "◉ SCAN" : "◎ SCAN"}
        </button>
        <button
          type="button"
          data-ocid="hud.command.button"
          onClick={() => openDashboard("command")}
          style={compactBtnStyle(dashboardOpen, "#00ccff")}
          title="Command Dashboard"
        >
          {dashboardOpen ? "⬡ SYS" : "⬡ CMD"}
        </button>
      </div>

      {/* ── Minimal target indicator — top-left corner ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(8px, 1.8vh, 18px)",
          left: "clamp(10px, 2.5vw, 36px)",
          zIndex: 20,
          pointerEvents: "none",
          fontFamily: "monospace",
          fontSize: "clamp(8px, 0.9vw, 10px)",
          letterSpacing: "0.18em",
          color: selectedNode ? "#00ffcc" : "rgba(0,180,255,0.4)",
          textShadow: selectedNode ? "0 0 8px #00ffcc88" : "none",
          transition: "color 0.3s",
          whiteSpace: "nowrap",
        }}
      >
        {selectedNode ? `▸ LOCKED — ${selectedNode}` : "▸ NO TARGET"}
      </div>
    </>
  );
}

function compactBtnStyle(
  active: boolean,
  activeColor: string,
): React.CSSProperties {
  return {
    padding: "4px 10px",
    fontFamily: "monospace",
    fontSize: "clamp(8px, 0.85vw, 10px)",
    letterSpacing: "0.18em",
    fontWeight: 700,
    color: active ? activeColor : "rgba(0,200,255,0.75)",
    background: active ? "rgba(0,50,70,0.9)" : "rgba(0,8,20,0.82)",
    border: `1px solid ${active ? `${activeColor}99` : "rgba(0,200,255,0.3)"}`,
    borderRadius: 2,
    cursor: "pointer",
    backdropFilter: "blur(6px)",
    boxShadow: active ? `0 0 10px ${activeColor}44` : "none",
    transition: "all 0.2s ease",
    minHeight: 30,
    whiteSpace: "nowrap" as const,
  };
}
