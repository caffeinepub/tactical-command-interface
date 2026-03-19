/**
 * AlertPanel — persistent scrollable alert resolution panel
 */
import { useEffect, useState } from "react";
import { useCreditsStore } from "../credits/useCreditsStore";
import { type ActiveAlert, useAlertsStore } from "./useAlertsStore";

function formatCountdown(alert: ActiveAlert): string {
  if (alert.status !== "active") return alert.status.toUpperCase();
  const remaining = Math.max(
    0,
    alert.startedAt + alert.durationMs - Date.now(),
  );
  const totalSec = Math.floor(remaining / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function AlertCard({ alert }: { alert: ActiveAlert }) {
  const [expanded, setExpanded] = useState(false);
  const [, tick] = useState(0);
  const resolveAlert = useAlertsStore((s) => s.resolveAlert);
  const dismissAlert = useAlertsStore((s) => s.dismissAlert);
  const balance = useCreditsStore((s) => s.balance);

  useEffect(() => {
    if (alert.status !== "active") return;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [alert.status]);

  const isCritical = alert.severity === "critical";
  const isActive = alert.status === "active";
  const countdown = formatCountdown(alert);

  const borderColor = isCritical
    ? isActive
      ? "rgba(255,50,50,0.5)"
      : "rgba(120,30,30,0.3)"
    : "rgba(0,180,255,0.18)";
  const headerColor = isCritical ? "#ff5544" : "rgba(0,200,255,0.8)";

  return (
    <div
      style={{
        background: "rgba(0,8,22,0.9)",
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        marginBottom: 8,
        animation:
          isCritical && isActive
            ? "criticalPulse 2s ease-in-out infinite"
            : "none",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <button
        type="button"
        style={{
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          width: "100%",
          background: "none",
          border: "none",
          outline: "none",
          textAlign: "left",
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Severity dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: isCritical ? "#ff3333" : "#ffaa00",
            boxShadow: isCritical ? "0 0 6px #ff333388" : "0 0 4px #ffaa0088",
            flexShrink: 0,
            animation:
              isCritical && isActive
                ? "dotBlink 1s ease-in-out infinite"
                : "none",
          }}
        />
        {/* Title + system */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: isActive ? headerColor : "rgba(120,140,160,0.6)",
              marginBottom: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {alert.title}
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color: "rgba(0,140,180,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {alert.affectedSystem}
          </div>
        </div>
        {/* Severity badge */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: isCritical ? "#ff3333" : "#ffaa00",
            background: isCritical
              ? "rgba(255,30,30,0.12)"
              : "rgba(255,160,0,0.12)",
            border: `1px solid ${isCritical ? "rgba(255,50,50,0.3)" : "rgba(255,160,0,0.3)"}`,
            borderRadius: 2,
            padding: "2px 5px",
            flexShrink: 0,
          }}
        >
          {isCritical ? "CRITICAL" : "NORMAL"}
        </span>
        {/* Countdown / status */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color:
              alert.status === "resolved"
                ? "#00ffaa"
                : alert.status === "failed"
                  ? "#ff4433"
                  : alert.status === "dismissed"
                    ? "rgba(100,120,140,0.5)"
                    : isCritical
                      ? "#ff7766"
                      : "rgba(0,200,255,0.8)",
            flexShrink: 0,
            minWidth: 38,
            textAlign: "right",
          }}
        >
          {countdown}
        </span>
        {/* Expand chevron */}
        {isActive && (
          <span
            style={{
              color: "rgba(0,160,200,0.5)",
              fontSize: 10,
              flexShrink: 0,
              transition: "transform 0.2s",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▾
          </span>
        )}
      </button>

      {/* Description (always visible) */}
      <div
        style={{
          padding: "0 12px 8px 28px",
          fontFamily: "monospace",
          fontSize: 8,
          color: "rgba(0,160,200,0.45)",
          letterSpacing: "0.06em",
          lineHeight: 1.5,
        }}
      >
        {alert.description}
      </div>

      {/* Responses (expanded) */}
      {expanded && isActive && (
        <div
          style={{
            borderTop: "1px solid rgba(0,140,200,0.12)",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {alert.responses.map((resp) => {
            const canAfford =
              resp.creditCost === 0 || balance >= resp.creditCost;
            return (
              <button
                key={resp.id}
                type="button"
                disabled={!canAfford}
                data-ocid="alerts.button"
                onClick={() => resolveAlert(alert.id, resp.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontFamily: "monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: canAfford
                    ? "rgba(0,220,255,0.9)"
                    : "rgba(80,100,120,0.5)",
                  background: canAfford
                    ? "rgba(0,20,50,0.8)"
                    : "rgba(0,8,20,0.5)",
                  border: `1px solid ${
                    canAfford ? "rgba(0,180,255,0.3)" : "rgba(0,80,100,0.2)"
                  }`,
                  borderRadius: 4,
                  padding: "8px 10px",
                  minHeight: 36,
                  cursor: canAfford ? "pointer" : "not-allowed",
                  outline: "none",
                  WebkitTapHighlightColor: "transparent",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <span>{resp.label}</span>
                {resp.creditCost > 0 && (
                  <span
                    style={{
                      fontSize: 8,
                      color: canAfford ? "#ffee66" : "#ff4433",
                      background: canAfford
                        ? "rgba(255,220,0,0.1)"
                        : "rgba(255,50,30,0.1)",
                      border: `1px solid ${
                        canAfford
                          ? "rgba(255,200,0,0.25)"
                          : "rgba(255,50,30,0.25)"
                      }`,
                      borderRadius: 2,
                      padding: "1px 5px",
                      whiteSpace: "nowrap",
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
      )}

      {/* Resolved/failed footer */}
      {(alert.status === "resolved" || alert.status === "failed") && (
        <div
          style={{
            padding: "4px 12px 8px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 8,
              color:
                alert.status === "resolved"
                  ? "rgba(0,220,160,0.6)"
                  : "rgba(255,80,60,0.5)",
              letterSpacing: "0.1em",
            }}
          >
            {alert.status === "resolved"
              ? `+${alert.creditsReward} CR EARNED`
              : "CONSEQUENCE APPLIED"}
          </span>
          <button
            type="button"
            data-ocid="alerts.dismiss_button"
            onClick={() => dismissAlert(alert.id)}
            style={{
              fontFamily: "monospace",
              fontSize: 7,
              color: "rgba(0,120,160,0.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              outline: "none",
              letterSpacing: "0.1em",
            }}
          >
            DISMISS
          </button>
        </div>
      )}
    </div>
  );
}

export default function AlertPanel() {
  const alerts = useAlertsStore((s) => s.alerts);
  const active = alerts.filter((a) => a.status === "active");
  const historical = alerts
    .filter(
      (a) =>
        a.status === "resolved" ||
        a.status === "failed" ||
        a.status === "dismissed",
    )
    .slice(0, 5);

  return (
    <div
      style={{
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
      data-ocid="alerts.panel"
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
        <span>▸ SYSTEM ALERTS ({active.length} ACTIVE)</span>
        {active.filter((a) => a.severity === "critical").length > 0 && (
          <span
            style={{
              fontSize: 8,
              color: "#ff4433",
              letterSpacing: "0.1em",
              animation: "dotBlink 1s ease-in-out infinite",
            }}
          >
            ⚠ CRITICAL
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
          WebkitOverflowScrolling: "touch" as unknown as undefined,
        }}
      >
        {active.length === 0 && historical.length === 0 ? (
          <div
            data-ocid="alerts.empty_state"
            style={{
              padding: "24px 16px",
              textAlign: "center",
              border: "1px solid rgba(0,220,255,0.1)",
              background: "rgba(0,10,25,0.4)",
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
          <>
            {active.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
            {historical.length > 0 && (
              <>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 8,
                    color: "rgba(0,120,160,0.4)",
                    letterSpacing: "0.16em",
                    padding: "8px 0 4px",
                    borderTop:
                      active.length > 0
                        ? "1px solid rgba(0,100,140,0.12)"
                        : "none",
                    marginTop: active.length > 0 ? 8 : 0,
                  }}
                >
                  RECENT HISTORY
                </div>
                {historical.map((a) => (
                  <AlertCard key={a.id} alert={a} />
                ))}
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes criticalPulse {
          0%, 100% { border-color: rgba(255,50,50,0.5); box-shadow: none; }
          50% { border-color: rgba(255,80,60,0.9); box-shadow: 0 0 8px rgba(255,50,50,0.25); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
