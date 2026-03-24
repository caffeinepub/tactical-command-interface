/**
 * WarModeToggle — compact WAR ON/OFF pill button.
 * Placed in the top HUD controls row or command panel.
 * V17.2: suppresses threat spawning when toggled off.
 */
import { useTestModeStore } from "./useTestModeStore";

export default function WarModeToggle() {
  const warEnabled = useTestModeStore((s) => s.warEnabled);
  const toggleWar = useTestModeStore((s) => s.toggleWar);

  return (
    <button
      type="button"
      onClick={toggleWar}
      title={warEnabled ? "Disable war / test mode" : "Enable war mode"}
      style={{
        padding: "0 10px",
        fontFamily: "monospace",
        fontSize: "clamp(8px, 0.85vw, 10px)",
        letterSpacing: "0.16em",
        fontWeight: 700,
        color: warEnabled ? "#ff4444" : "#00ffcc",
        background: warEnabled ? "rgba(80,0,0,0.75)" : "rgba(0,30,20,0.8)",
        border: `1px solid ${warEnabled ? "#ff444488" : "#00ffcc66"}`,
        borderRadius: 2,
        cursor: "pointer",
        backdropFilter: "blur(6px)",
        boxShadow: warEnabled ? "0 0 10px #ff444422" : "0 0 10px #00ffcc22",
        transition: "all 0.2s ease",
        minHeight: 44,
        minWidth: 56,
        whiteSpace: "nowrap" as const,
        pointerEvents: "auto" as const,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        gap: 5,
        animation: warEnabled
          ? undefined
          : "war-pulse 2.5s ease-in-out infinite",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: warEnabled ? "#ff4444" : "#00ffcc",
          boxShadow: `0 0 5px ${warEnabled ? "#ff4444" : "#00ffcc"}`,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      {warEnabled ? "WAR: ON" : "WAR: OFF"}
      <style>{`
        @keyframes war-pulse {
          0%,100% { box-shadow: 0 0 10px #00ffcc22; }
          50%      { box-shadow: 0 0 18px #00ffcc55; }
        }
      `}</style>
    </button>
  );
}
