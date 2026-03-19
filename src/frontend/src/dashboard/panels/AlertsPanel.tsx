import { memo } from "react";
import { useDashboardStore } from "../../useDashboardStore";

const LEVEL_ICONS: Record<string, string> = {
  WARN: "⚠",
  CRITICAL: "✕",
  INFO: "ℹ",
};

const LEVEL_COLORS: Record<string, string> = {
  WARN: "#ffaa00",
  CRITICAL: "#ff3344",
  INFO: "#00e8ff",
};

const AlertsPanel = memo(function AlertsPanel() {
  const { alerts, dismissAlert } = useDashboardStore();

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
        ▸ SYSTEM ALERTS ({alerts.length})
      </div>

      {alerts.length === 0 && (
        <div
          data-ocid="alerts.empty_state"
          style={{
            padding: "24px",
            textAlign: "center",
            border: "1px solid rgba(0,220,255,0.1)",
            background: "rgba(0,10,25,0.4)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: "rgba(0,255,136,0.6)",
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
            }}
          >
            NO ACTIVE ALERTS
          </div>
        </div>
      )}

      {alerts.map((alert, i) => {
        const color = LEVEL_COLORS[alert.level];
        const icon = LEVEL_ICONS[alert.level];
        return (
          <div
            key={alert.id}
            data-ocid={`alerts.item.${i + 1}`}
            style={{
              padding: "10px 12px",
              border: `1px solid ${color}33`,
              background: `${color}08`,
              marginBottom: 8,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 12, color, flexShrink: 0, marginTop: 1 }}>
              {icon}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.4)",
                  marginBottom: 3,
                  letterSpacing: "0.1em",
                }}
              >
                {alert.level} · {alert.timestamp}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(0,220,255,0.8)",
                  letterSpacing: "0.06em",
                  lineHeight: 1.4,
                }}
              >
                {alert.message}
              </div>
            </div>
            <button
              type="button"
              data-ocid={`alerts.delete_button.${i + 1}`}
              onClick={() => dismissAlert(alert.id)}
              style={{
                background: "transparent",
                border: "1px solid rgba(0,220,255,0.2)",
                color: "rgba(0,180,255,0.5)",
                fontFamily: "monospace",
                fontSize: 10,
                cursor: "pointer",
                padding: "4px 8px",
                flexShrink: 0,
                minHeight: 44,
                minWidth: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
});

export default AlertsPanel;
