import { r as reactExports, j as jsxRuntimeExports, u as useDashboardStore } from "./index-Q-pEkA7Z.js";
const SEVERITY_COLORS = {
  INFO: "#00e8ff",
  WARNING: "#ffaa00",
  CRITICAL: "#ff3344"
};
const SEVERITY_LABELS = {
  INFO: "INFO",
  WARNING: "WARN",
  CRITICAL: "CRIT"
};
const AlertRow = reactExports.memo(function AlertRow2({
  alert,
  index,
  expanded,
  onToggle,
  onDismiss
}) {
  const color = SEVERITY_COLORS[alert.level];
  const label = SEVERITY_LABELS[alert.level];
  const isCritical = alert.level === "CRITICAL";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `alerts.item.${index}`,
      "data-critical": isCritical ? "true" : void 0,
      style: {
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
        animation: isCritical ? "alertPulse 2.4s ease-in-out infinite" : void 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              overflow: "hidden",
              minHeight: 44
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: onToggle,
                  style: {
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
                    minWidth: 0
                  },
                  "aria-expanded": expanded,
                  "aria-label": `${alert.level} alert: ${alert.title}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 8,
                          fontWeight: 700,
                          color,
                          background: `${color}18`,
                          border: `1px solid ${color}44`,
                          padding: "2px 5px",
                          letterSpacing: "0.12em",
                          flexShrink: 0,
                          whiteSpace: "nowrap"
                        },
                        children: label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          flex: 1,
                          fontFamily: "monospace",
                          fontSize: 10,
                          color: "rgba(0,220,255,0.9)",
                          letterSpacing: "0.08em",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          minWidth: 0
                        },
                        children: alert.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 8,
                          color: "rgba(0,180,255,0.4)",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          marginRight: 2
                        },
                        children: alert.timestamp
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 9,
                          color: `${color}88`,
                          flexShrink: 0,
                          transition: "transform 0.2s ease",
                          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                          display: "inline-block"
                        },
                        children: "▶"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `alerts.delete_button.${index}`,
                  onClick: onDismiss,
                  style: {
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
                    transition: "all 0.15s ease"
                  },
                  "aria-label": "Dismiss alert",
                  children: "✕"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              maxHeight: expanded ? 200 : 0,
              overflow: "hidden",
              transition: "max-height 0.25s ease"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  padding: "8px 10px 10px 10px",
                  borderTop: `1px solid ${color}22`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      style: {
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "rgba(0,200,255,0.7)",
                        letterSpacing: "0.05em",
                        lineHeight: 1.6,
                        margin: "0 0 6px 0",
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                      },
                      children: alert.message
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontFamily: "monospace",
                        fontSize: 8,
                        color: alert.acknowledged ? "rgba(0,255,136,0.6)" : "rgba(255,170,0,0.5)",
                        letterSpacing: "0.12em"
                      },
                      children: alert.acknowledged ? "● ACKNOWLEDGED" : "○ UNACKNOWLEDGED"
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
});
const AlertsPanel = reactExports.memo(function AlertsPanel2() {
  const { alerts, dismissAlert } = useDashboardStore();
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const handleToggle = (id) => {
    setExpandedId((prev) => prev === id ? null : id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "12px"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
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
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "▸ SYSTEM ALERTS (",
                alerts.length,
                ")"
              ] }),
              alerts.filter((a) => !a.acknowledged).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: {
                    fontSize: 8,
                    color: "#ffaa00",
                    letterSpacing: "0.1em"
                  },
                  children: [
                    alerts.filter((a) => !a.acknowledged).length,
                    " UNACK"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              minHeight: 0,
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              paddingRight: 2
            },
            children: alerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "alerts.empty_state",
                style: {
                  padding: "24px 16px",
                  textAlign: "center",
                  border: "1px solid rgba(0,220,255,0.1)",
                  background: "rgba(0,10,25,0.4)",
                  boxSizing: "border-box"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "rgba(0,255,136,0.7)",
                        letterSpacing: "0.2em"
                      },
                      children: "ALL SYSTEMS NOMINAL"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: "rgba(0,180,255,0.3)",
                        marginTop: 4,
                        letterSpacing: "0.12em"
                      },
                      children: "NO ACTIVE ALERTS"
                    }
                  )
                ]
              }
            ) : alerts.map((alert, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertRow,
              {
                alert,
                index: i + 1,
                expanded: expandedId === alert.id,
                onToggle: () => handleToggle(alert.id),
                onDismiss: () => dismissAlert(alert.id)
              },
              alert.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes alertPulse {
          0%, 100% { border-left-color: #ff334488; }
          50% { border-left-color: #ff3344ee; box-shadow: inset 2px 0 6px #ff334422; }
        }
      ` })
      ]
    }
  );
});
export {
  AlertsPanel as default
};
