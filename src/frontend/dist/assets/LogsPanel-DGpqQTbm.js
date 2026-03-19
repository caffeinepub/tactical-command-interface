import { r as reactExports, u as useDashboardStore, j as jsxRuntimeExports } from "./index-Q-pEkA7Z.js";
const CATEGORY_COLORS = {
  SYS: "rgba(0,180,255,0.7)",
  SCAN: "#40ffcc",
  COMBAT: "#ff6644",
  NAV: "#8080ff"
};
const LogsPanel = reactExports.memo(function LogsPanel2() {
  const { logs } = useDashboardStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
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
        children: "▸ SYSTEM LOG"
      }
    ),
    logs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "logs.empty_state",
        style: {
          padding: "24px",
          textAlign: "center",
          border: "1px solid rgba(0,220,255,0.1)",
          background: "rgba(0,10,25,0.4)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontSize: 10,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.3)",
              letterSpacing: "0.2em"
            },
            children: "NO LOG ENTRIES"
          }
        )
      }
    ),
    logs.map((entry, i) => {
      const catColor = CATEGORY_COLORS[entry.category] ?? "rgba(0,180,255,0.6)";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `logs.item.${i + 1}`,
          style: {
            display: "flex",
            gap: 10,
            padding: "6px 0",
            borderBottom: "1px solid rgba(0,220,255,0.06)",
            alignItems: "baseline"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.35)",
                  letterSpacing: "0.08em",
                  flexShrink: 0,
                  width: 52
                },
                children: entry.timestamp
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: catColor,
                  letterSpacing: "0.12em",
                  border: `0.5px solid ${catColor}44`,
                  padding: "1px 4px",
                  flexShrink: 0,
                  fontWeight: 700
                },
                children: entry.category
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: "rgba(0,220,255,0.7)",
                  letterSpacing: "0.06em",
                  lineHeight: 1.4
                },
                children: entry.message
              }
            )
          ]
        },
        entry.id
      );
    })
  ] });
});
export {
  LogsPanel as default
};
