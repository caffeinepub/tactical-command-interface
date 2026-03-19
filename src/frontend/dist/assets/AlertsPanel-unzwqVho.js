import { r as reactExports, u as useDashboardStore, j as jsxRuntimeExports } from "./index-BOQ0Ga6i.js";
const LEVEL_ICONS = {
  WARN: "⚠",
  CRITICAL: "✕",
  INFO: "ℹ"
};
const LEVEL_COLORS = {
  WARN: "#ffaa00",
  CRITICAL: "#ff3344",
  INFO: "#00e8ff"
};
const AlertsPanel = reactExports.memo(function AlertsPanel2() {
  const { alerts, dismissAlert } = useDashboardStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 12,
          borderBottom: "1px solid rgba(0,220,255,0.1)",
          paddingBottom: 4
        },
        children: [
          "▸ SYSTEM ALERTS (",
          alerts.length,
          ")"
        ]
      }
    ),
    alerts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "alerts.empty_state",
        style: {
          padding: "24px",
          textAlign: "center",
          border: "1px solid rgba(0,220,255,0.1)",
          background: "rgba(0,10,25,0.4)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 11,
                fontFamily: "monospace",
                color: "rgba(0,255,136,0.6)",
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
                marginTop: 4
              },
              children: "NO ACTIVE ALERTS"
            }
          )
        ]
      }
    ),
    alerts.map((alert, i) => {
      const color = LEVEL_COLORS[alert.level];
      const icon = LEVEL_ICONS[alert.level];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `alerts.item.${i + 1}`,
          style: {
            padding: "10px 12px",
            border: `1px solid ${color}33`,
            background: `${color}08`,
            marginBottom: 8,
            display: "flex",
            gap: 10,
            alignItems: "flex-start"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color, flexShrink: 0, marginTop: 1 }, children: icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontSize: 8,
                    fontFamily: "monospace",
                    color: "rgba(0,180,255,0.4)",
                    marginBottom: 3,
                    letterSpacing: "0.1em"
                  },
                  children: [
                    alert.level,
                    " · ",
                    alert.timestamp
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontSize: 10,
                    fontFamily: "monospace",
                    color: "rgba(0,220,255,0.8)",
                    letterSpacing: "0.06em",
                    lineHeight: 1.4
                  },
                  children: alert.message
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `alerts.delete_button.${i + 1}`,
                onClick: () => dismissAlert(alert.id),
                style: {
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
                  transition: "all 0.2s ease"
                },
                "aria-label": "Dismiss alert",
                children: "✕"
              }
            )
          ]
        },
        alert.id
      );
    })
  ] });
});
export {
  AlertsPanel as default
};
