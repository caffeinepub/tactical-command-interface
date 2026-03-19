import { r as reactExports, u as useDashboardStore, j as jsxRuntimeExports } from "./index-niuJsG6O.js";
const DAMAGE_LOG = [
  { time: "04:08:22", source: "METEORITE IMPACT", impact: 3 },
  { time: "04:05:11", source: "PLASMA DISCHARGE", impact: 7 },
  { time: "03:58:44", source: "DEBRIS FIELD", impact: 2 }
];
function SegmentedBar({
  value,
  segments,
  color
}) {
  const filled = Math.round(value / 100 * segments);
  const segs = Array.from({ length: segments }, (_, i) => i);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 3, marginTop: 4 }, children: segs.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        flex: 1,
        height: 10,
        background: i < filled ? color : "rgba(0,100,150,0.2)",
        boxShadow: i < filled ? `0 0 6px ${color}88` : "none",
        border: `0.5px solid ${i < filled ? `${color}44` : "rgba(0,100,150,0.2)"}`,
        transition: "background 0.3s ease"
      }
    },
    `seg-pos-${i}`
  )) });
}
const ShieldsPanel = reactExports.memo(function ShieldsPanel2() {
  const { shipStatus } = useDashboardStore();
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
        children: "▸ SHIELD SYSTEMS"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "10px 12px",
          border: "1px solid rgba(0,220,255,0.2)",
          background: "rgba(0,10,25,0.5)",
          marginBottom: 10
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: "rgba(0,180,255,0.5)",
                      letterSpacing: "0.15em"
                    },
                    children: "SHIELD INTEGRITY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      fontSize: 12,
                      fontFamily: "monospace",
                      color: "#00e8ff",
                      fontWeight: 700
                    },
                    children: [
                      shipStatus.shields,
                      "%"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SegmentedBar, { value: shipStatus.shields, segments: 8, color: "#00e8ff" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.4)",
                marginTop: 6,
                letterSpacing: "0.1em"
              },
              children: "RECHARGE RATE: 0.4%/s — NOMINAL"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "10px 12px",
          border: "1px solid rgba(0,255,136,0.2)",
          background: "rgba(0,10,25,0.5)",
          marginBottom: 14
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: "rgba(0,180,255,0.5)",
                      letterSpacing: "0.15em"
                    },
                    children: "HULL INTEGRITY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      fontSize: 12,
                      fontFamily: "monospace",
                      color: shipStatus.hull > 60 ? "#00ff88" : "#ffaa00",
                      fontWeight: 700
                    },
                    children: [
                      shipStatus.hull,
                      "%"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SegmentedBar,
            {
              value: shipStatus.hull,
              segments: 8,
              color: shipStatus.hull > 60 ? "#00ff88" : "#ffaa00"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 8
        },
        children: "▸ DAMAGE LOG"
      }
    ),
    DAMAGE_LOG.map((hit) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "1px solid rgba(0,220,255,0.06)",
          alignItems: "center"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.4)",
                letterSpacing: "0.08em"
              },
              children: hit.time
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(0,220,255,0.7)",
                letterSpacing: "0.08em"
              },
              children: hit.source
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              style: {
                fontSize: 9,
                fontFamily: "monospace",
                color: "#ff8888",
                fontWeight: 700
              },
              children: [
                "-",
                hit.impact,
                "%"
              ]
            }
          )
        ]
      },
      hit.time
    ))
  ] });
});
export {
  ShieldsPanel as default
};
