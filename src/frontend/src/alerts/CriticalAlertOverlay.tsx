/**
 * CriticalAlertOverlay — floating non-modal overlay for critical alerts.
 * Positioned top-right, zIndex 45. Player can still play.
 */
import { useEffect, useState } from "react";
import { useCreditsStore } from "../credits/useCreditsStore";
import { type ActiveAlert, useAlertsStore } from "./useAlertsStore";

function CriticalCard({
  alert,
  onResolve,
}: {
  alert: ActiveAlert;
  onResolve: (alertId: string, responseId: string) => void;
}) {
  const [, tick] = useState(0);
  const balance = useCreditsStore((s) => s.balance);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(
    0,
    alert.startedAt + alert.durationMs - Date.now(),
  );
  const totalSec = Math.floor(remaining / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const pct = remaining / alert.durationMs;

  const quickResponses = alert.responses.slice(0, 2);

  return (
    <div
      style={{
        background: "rgba(10,2,4,0.95)",
        border: "1px solid rgba(255,50,50,0.6)",
        borderRadius: 6,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        animation: "critOverlayPulse 1.8s ease-in-out infinite",
      }}
    >
      {/* Title + timer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 8,
            color: "#ff3333",
            animation: "dotBlink 0.8s ease-in-out infinite",
          }}
        >
          ⚠
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              color: "#ff6655",
              letterSpacing: "0.12em",
              lineHeight: 1.2,
            }}
          >
            {alert.title}
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 7,
              color: "rgba(200,100,80,0.6)",
              letterSpacing: "0.1em",
              marginTop: 1,
            }}
          >
            {alert.affectedSystem}
          </div>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            fontWeight: 700,
            color: pct < 0.3 ? "#ff2222" : "#ff8866",
            letterSpacing: "0.05em",
            flexShrink: 0,
          }}
        >
          {mm}:{ss}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 2,
          background: "rgba(255,30,30,0.15)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct * 100}%`,
            background:
              pct < 0.3
                ? "linear-gradient(90deg, #ff2222, #ff5544)"
                : "linear-gradient(90deg, #ff6644, #ff8866)",
            transition: "width 0.9s linear",
          }}
        />
      </div>

      {/* Quick action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {quickResponses.map((resp) => {
          const canAfford = resp.creditCost === 0 || balance >= resp.creditCost;
          return (
            <button
              key={resp.id}
              type="button"
              disabled={!canAfford}
              data-ocid="alerts.button"
              onClick={() => onResolve(alert.id, resp.id)}
              style={{
                fontFamily: "monospace",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: canAfford
                  ? "rgba(0,220,255,0.9)"
                  : "rgba(80,80,100,0.5)",
                background: canAfford
                  ? "rgba(0,15,40,0.9)"
                  : "rgba(0,5,15,0.7)",
                border: `1px solid ${
                  canAfford ? "rgba(0,160,220,0.35)" : "rgba(40,50,70,0.3)"
                }`,
                borderRadius: 3,
                padding: "6px 8px",
                minHeight: 32,
                cursor: canAfford ? "pointer" : "not-allowed",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                width: "100%",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{resp.label}</span>
              {resp.creditCost > 0 && (
                <span
                  style={{
                    fontSize: 7,
                    color: canAfford ? "#ffee66" : "#ff4433",
                    flexShrink: 0,
                  }}
                >
                  {canAfford
                    ? `${resp.creditCost} CR`
                    : `NEED ${resp.creditCost} CR`}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CriticalAlertOverlay() {
  const [minimized, setMinimized] = useState(false);
  const criticalAlerts = useAlertsStore((s) =>
    s.alerts.filter((a) => a.severity === "critical" && a.status === "active"),
  );
  const resolveAlert = useAlertsStore((s) => s.resolveAlert);

  if (criticalAlerts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "clamp(56px, 8vh, 80px)",
        right: "clamp(8px, 2vw, 16px)",
        zIndex: 45,
        maxWidth: 280,
        width: "min(280px, calc(100vw - 20px))",
        pointerEvents: "auto",
      }}
    >
      {minimized ? (
        <button
          type="button"
          data-ocid="alerts.open_modal_button"
          onClick={() => setMinimized(false)}
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#ff5544",
            background: "rgba(10,2,4,0.95)",
            border: "1px solid rgba(255,50,50,0.5)",
            borderRadius: 4,
            padding: "6px 12px",
            cursor: "pointer",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            animation: "dotBlink 1s ease-in-out infinite",
          }}
        >
          ⚠ CRITICAL ({criticalAlerts.length})
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Minimize button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              data-ocid="alerts.close_button"
              onClick={() => setMinimized(true)}
              style={{
                fontFamily: "monospace",
                fontSize: 7,
                color: "rgba(180,60,60,0.6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                outline: "none",
                padding: "2px 6px",
                letterSpacing: "0.1em",
              }}
            >
              MINIMIZE ▴
            </button>
          </div>
          {criticalAlerts.map((a) => (
            <CriticalCard key={a.id} alert={a} onResolve={resolveAlert} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes critOverlayPulse {
          0%, 100% { border-color: rgba(255,50,50,0.6); }
          50% { border-color: rgba(255,80,60,1); box-shadow: 0 0 12px rgba(255,40,40,0.3); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
