import { r as reactExports, j as jsxRuntimeExports } from "./index-Q-pEkA7Z.js";
const NAV_DATA = [
  { label: "HEADING", value: "247° NW-BY-WEST" },
  { label: "SECTOR / GRID", value: "ALPHA-7 / 14-C" },
  { label: "WAYPOINT", value: "NEXUS STATION — 4.2 AU", highlight: true },
  { label: "ROUTE STABILITY", value: "94% — STABLE" },
  { label: "TRAVEL STATE", value: "SUBLIGHT CRUISE" },
  { label: "ANOMALY PROXIMITY", value: "1.8 AU — CLASS II" },
  { label: "BLACK HOLE RISK", value: "LOW / DRIFT 0.003°" }
];
function useCountdown(seconds) {
  const [remaining, setRemaining] = reactExports.useState(seconds);
  reactExports.useEffect(() => {
    const id = setInterval(() => setRemaining((s2) => Math.max(0, s2 - 1)), 1e3);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(remaining / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  return `00:${m}:${s}`;
}
const NavigationPanel = reactExports.memo(function NavigationPanel2() {
  const jumpTimer = useCountdown(512);
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
        children: "▸ NAVIGATION DATA"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 10px",
          marginBottom: 14
        },
        children: [
          NAV_DATA.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "8px",
                border: `1px solid ${f.highlight ? "rgba(0,255,200,0.25)" : "rgba(0,220,255,0.15)"}`,
                background: f.highlight ? "rgba(0,20,15,0.5)" : "rgba(0,10,25,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: "rgba(0,180,255,0.5)",
                      letterSpacing: "0.15em",
                      marginBottom: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: f.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: f.highlight ? "#00ffcc" : "rgba(0,220,255,0.9)",
                      letterSpacing: "0.08em",
                      fontWeight: f.highlight ? 700 : 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: f.value
                  }
                )
              ]
            },
            f.label
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                gridColumn: "1 / -1",
                padding: "8px",
                border: "1px solid rgba(0,255,120,0.25)",
                background: "rgba(0,20,10,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: "rgba(0,180,255,0.5)",
                      letterSpacing: "0.15em",
                      marginBottom: 3
                    },
                    children: "JUMP WINDOW"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontSize: 10,
                      fontFamily: "monospace",
                      color: "#00ff88",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      textShadow: "0 0 6px #00ff88"
                    },
                    children: [
                      "T-MINUS ",
                      jumpTimer
                    ]
                  }
                )
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
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 8
        },
        children: "▸ ROUTE PATH"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "12px",
          border: "1px solid rgba(0,220,255,0.15)",
          background: "rgba(0,10,25,0.5)",
          position: "relative",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 0,
                position: "relative"
              },
              children: ["ORIGIN", "RELAY-4", "WAYPOINT", "NEXUS"].map((pt, i, arr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    flex: i < arr.length - 1 ? 1 : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: i === 2 ? 10 : 7,
                          height: i === 2 ? 10 : 7,
                          borderRadius: "50%",
                          background: i <= 1 ? "#00ffcc" : i === 2 ? "#00e8ff" : "rgba(0,180,255,0.3)",
                          border: i === 2 ? "1px solid #00e8ff" : "none",
                          boxShadow: i <= 2 ? "0 0 8px rgba(0,220,255,0.6)" : "none",
                          flexShrink: 0
                        }
                      }
                    ),
                    i < arr.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          flex: 1,
                          height: 1,
                          background: i < 2 ? "linear-gradient(90deg, #00ffcc, rgba(0,220,255,0.3))" : "rgba(0,100,150,0.3)",
                          margin: "0 2px"
                        }
                      }
                    )
                  ]
                },
                pt
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4
              },
              children: ["ORIGIN", "RELAY-4", "◉ HERE", "NEXUS"].map((lbl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: 7,
                    fontFamily: "monospace",
                    color: lbl === "◉ HERE" ? "#00e8ff" : "rgba(0,180,255,0.4)",
                    letterSpacing: "0.08em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "25%"
                  },
                  children: lbl
                },
                lbl
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          padding: "8px 10px",
          border: "1px solid rgba(255,170,0,0.25)",
          background: "rgba(30,15,0,0.4)",
          fontSize: 9,
          fontFamily: "monospace",
          color: "#ffaa00",
          letterSpacing: "0.1em",
          marginTop: 10
        },
        children: "⚠ CLASS II GRAVITATIONAL DISTORTION AT 14-C — COURSE CORRECTION ADVISED"
      }
    )
  ] });
});
export {
  NavigationPanel as default
};
