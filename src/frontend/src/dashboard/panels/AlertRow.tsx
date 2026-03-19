import { memo } from "react";
import type { Alert } from "../../useDashboardStore";

const SEVERITY_COLORS: Record<Alert["level"], string> = {
  INFO: "#00e8ff",
  WARNING: "#ffaa00",
  CRITICAL: "#ff3344",
};

const SEVERITY_LABELS: Record<Alert["level"], string> = {
  INFO: "INFO",
  WARNING: "WARN",
  CRITICAL: "CRIT",
};

interface AlertRowProps {
  alert: Alert;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onDismiss: () => void;
}

const AlertRow = memo(function AlertRow({
  alert,
  index,
  expanded,
  onToggle,
  onDismiss,
}: AlertRowProps) {
  const color = SEVERITY_COLORS[alert.level];
  const label = SEVERITY_LABELS[alert.level];
  const isCritical = alert.level === "CRITICAL";

  return (
    <div
      data-ocid={`alerts.item.${index}`}
      data-critical={isCritical ? "true" : undefined}
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        marginBottom: 6,
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        background: expanded ? `${color}12` : `${color}06`,
        transition: "background 0.2s ease",
        animation: isCritical
          ? "alertPulse 2.4s ease-in-out infinite"
          : undefined,
      }}
    >
      {/* Row header — flex row with toggle area + dismiss button as siblings */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          minHeight: 44,
        }}
      >
        {/* Toggle button — takes up most of the row */}
        <button
          type="button"
          onClick={onToggle}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 6px 8px 10px",
            cursor: "pointer",
            minHeight: 44,
            boxSizing: "border-box",
            overflow: "hidden",
            background: "transparent",
            border: "none",
            textAlign: "left",
            minWidth: 0,
          }}
          aria-expanded={expanded}
          aria-label={`${alert.level} alert: ${alert.title}`}
        >
          {/* Severity badge */}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              fontWeight: 700,
              color,
              background: `${color}18`,
              border: `1px solid ${color}44`,
              padding: "2px 5px",
              letterSpacing: "0.12em",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>

          {/* Title */}
          <span
            style={{
              flex: 1,
              fontFamily: "monospace",
              fontSize: 10,
              color: "rgba(0,220,255,0.9)",
              letterSpacing: "0.08em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {alert.title}
          </span>

          {/* Timestamp */}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: "rgba(0,180,255,0.4)",
              flexShrink: 0,
              whiteSpace: "nowrap",
              marginRight: 2,
            }}
          >
            {alert.timestamp}
          </span>

          {/* Expand chevron */}
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: `${color}88`,
              flexShrink: 0,
              transition: "transform 0.2s ease",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▶
          </span>
        </button>

        {/* Dismiss button — sibling of toggle button */}
        <button
          type="button"
          data-ocid={`alerts.delete_button.${index}`}
          onClick={onDismiss}
          style={{
            background: "transparent",
            border: "none",
            borderLeft: "1px solid rgba(0,220,255,0.1)",
            color: "rgba(0,180,255,0.4)",
            fontFamily: "monospace",
            fontSize: 10,
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            minHeight: 44,
            minWidth: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>

      {/* Expandable detail */}
      <div
        style={{
          maxHeight: expanded ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.25s ease",
        }}
      >
        <div
          style={{
            padding: "8px 10px 10px 10px",
            borderTop: `1px solid ${color}22`,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "rgba(0,200,255,0.7)",
              letterSpacing: "0.05em",
              lineHeight: 1.6,
              margin: "0 0 6px 0",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {alert.message}
          </p>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: alert.acknowledged
                ? "rgba(0,255,136,0.6)"
                : "rgba(255,170,0,0.5)",
              letterSpacing: "0.12em",
            }}
          >
            {alert.acknowledged ? "● ACKNOWLEDGED" : "○ UNACKNOWLEDGED"}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AlertRow;
