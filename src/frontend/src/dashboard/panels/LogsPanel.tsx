import { memo } from "react";
import { useDashboardStore } from "../../useDashboardStore";

const CATEGORY_COLORS: Record<string, string> = {
  SYS: "rgba(0,180,255,0.7)",
  SCAN: "#40ffcc",
  COMBAT: "#ff6644",
  NAV: "#8080ff",
};

const LogsPanel = memo(function LogsPanel() {
  const { logs } = useDashboardStore();

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
        ▸ SYSTEM LOG
      </div>

      {logs.length === 0 && (
        <div
          data-ocid="logs.empty_state"
          style={{
            padding: "24px",
            textAlign: "center",
            border: "1px solid rgba(0,220,255,0.1)",
            background: "rgba(0,10,25,0.4)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.3)",
              letterSpacing: "0.2em",
            }}
          >
            NO LOG ENTRIES
          </div>
        </div>
      )}

      {logs.map((entry, i) => {
        const catColor =
          CATEGORY_COLORS[entry.category] ?? "rgba(0,180,255,0.6)";
        return (
          <div
            key={entry.id}
            data-ocid={`logs.item.${i + 1}`}
            style={{
              display: "flex",
              gap: 10,
              padding: "6px 0",
              borderBottom: "1px solid rgba(0,220,255,0.06)",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.35)",
                letterSpacing: "0.08em",
                flexShrink: 0,
                width: 52,
              }}
            >
              {entry.timestamp}
            </span>
            <span
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: catColor,
                letterSpacing: "0.12em",
                border: `0.5px solid ${catColor}44`,
                padding: "1px 4px",
                flexShrink: 0,
                fontWeight: 700,
              }}
            >
              {entry.category}
            </span>
            <span
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(0,220,255,0.7)",
                letterSpacing: "0.06em",
                lineHeight: 1.4,
              }}
            >
              {entry.message}
            </span>
          </div>
        );
      })}
    </div>
  );
});

export default LogsPanel;
