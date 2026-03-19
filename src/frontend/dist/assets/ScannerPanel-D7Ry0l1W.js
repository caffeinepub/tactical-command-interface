import { r as reactExports, a as useTacticalStore, j as jsxRuntimeExports } from "./index-BOQ0Ga6i.js";
function DataBar({
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 12 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 10,
          marginBottom: 4
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(0,180,255,0.5)", letterSpacing: "0.12em" }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color, fontWeight: 700 }, children: value.toString().padStart(3, "0") })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          height: 5,
          background: "rgba(0,100,150,0.3)",
          border: "0.5px solid rgba(0,220,255,0.15)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              width: `${value}%`,
              background: `linear-gradient(90deg, ${color}66, ${color})`,
              boxShadow: `0 0 8px ${color}88`,
              transition: "width 0.6s ease"
            }
          }
        )
      }
    )
  ] });
}
const ScannerPanel = reactExports.memo(function ScannerPanel2() {
  const { selectedNode, nodeData } = useTacticalStore();
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
        children: "▸ SCANNER ARRAY"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "8px",
                border: "1px solid rgba(0,220,255,0.15)",
                background: "rgba(0,10,25,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: "rgba(0,180,255,0.5)",
                      letterSpacing: "0.12em",
                      marginBottom: 3
                    },
                    children: "SCAN RANGE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "rgba(0,220,255,0.9)",
                      fontWeight: 700
                    },
                    children: "2,400 KM"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                padding: "8px",
                border: "1px solid rgba(0,220,255,0.15)",
                background: "rgba(0,10,25,0.5)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 8,
                      fontFamily: "monospace",
                      color: "rgba(0,180,255,0.5)",
                      letterSpacing: "0.12em",
                      marginBottom: 3
                    },
                    children: "FREQUENCY"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: "rgba(0,220,255,0.9)",
                      fontWeight: 700
                    },
                    children: "7.4 GHz"
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    !selectedNode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "scanner.empty_state",
        style: {
          padding: "24px",
          border: "1px solid rgba(0,220,255,0.1)",
          background: "rgba(0,10,25,0.4)",
          textAlign: "center"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 11,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.3)",
                letterSpacing: "0.2em"
              },
              children: "NO TARGET LOCKED"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.2)",
                letterSpacing: "0.12em",
                marginTop: 4
              },
              children: "SELECT A NODE ON THE TACTICAL GLOBE"
            }
          )
        ]
      }
    ),
    selectedNode && nodeData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
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
          children: "▸ TARGET ANALYSIS"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            padding: "10px 12px",
            border: "1px solid rgba(0,255,200,0.3)",
            background: "rgba(0,20,40,0.5)",
            marginBottom: 12
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
                  marginBottom: 2
                },
                children: "TARGET ID"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontSize: 13,
                  fontFamily: "monospace",
                  color: "#00ffcc",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textShadow: "0 0 8px #00ffcc"
                },
                children: selectedNode
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataBar,
        {
          label: "ENERGY OUTPUT",
          value: nodeData.energy,
          color: "#00ccff"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataBar,
        {
          label: "SIGNAL STRENGTH",
          value: nodeData.signal,
          color: "#40ffcc"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataBar,
        {
          label: "STABILITY INDEX",
          value: nodeData.stability,
          color: "#8080ff"
        }
      )
    ] })
  ] });
});
export {
  ScannerPanel as default
};
