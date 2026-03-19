import { memo, useState } from "react";
import { useDashboardStore } from "../../useDashboardStore";
import AlertRow from "./AlertRow";

const AlertsPanel = memo(function AlertsPanel() {
  const { alerts, dismissAlert } = useDashboardStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: "rgba(0,180,255,0.55)",
          letterSpacing: "0.2em",
          marginBottom: 10,
          borderBottom: "1px solid rgba(0,220,255,0.1)",
          paddingBottom: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span>▸ SYSTEM ALERTS ({alerts.length})</span>
        {alerts.filter((a) => !a.acknowledged).length > 0 && (
          <span
            style={{
              fontSize: 8,
              color: "#ffaa00",
              letterSpacing: "0.1em",
            }}
          >
            {alerts.filter((a) => !a.acknowledged).length} UNACK
          </span>
        )}
      </div>

      {/* Alert list — flex-fills remaining height, scrolls internally */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          paddingRight: 2,
        }}
      >
        {alerts.length === 0 ? (
          <div
            data-ocid="alerts.empty_state"
            style={{
              padding: "24px 16px",
              textAlign: "center",
              border: "1px solid rgba(0,220,255,0.1)",
              background: "rgba(0,10,25,0.4)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "rgba(0,255,136,0.7)",
                letterSpacing: "0.2em",
              }}
            >
              ALL SYSTEMS NOMINAL
            </div>
            <div
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.3)",
                marginTop: 4,
                letterSpacing: "0.12em",
              }}
            >
              NO ACTIVE ALERTS
            </div>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              index={i + 1}
              expanded={expandedId === alert.id}
              onToggle={() => handleToggle(alert.id)}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))
        )}
      </div>

      {/* Pulse keyframe injection */}
      <style>{`
        @keyframes alertPulse {
          0%, 100% { border-left-color: #ff334488; }
          50% { border-left-color: #ff3344ee; box-shadow: inset 2px 0 6px #ff334422; }
        }
      `}</style>
    </div>
  );
});

export default AlertsPanel;
