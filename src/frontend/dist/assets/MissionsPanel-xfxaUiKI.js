import { r as reactExports, j as jsxRuntimeExports } from "./index-1qcPPyxW.js";
const MISSIONS = [
  {
    id: "m1",
    title: "SECURE SECTOR DELTA",
    priority: "PRIMARY",
    status: "ACTIVE",
    type: "COMBAT OP",
    threat: "HIGH",
    reward: "INTEL PACKAGE",
    timer: "14:22"
  },
  {
    id: "m2",
    title: "SCAN ANOMALY CLUSTER",
    priority: "SECONDARY",
    status: "ACTIVE",
    type: "RECON",
    threat: "MODERATE",
    reward: "NAV DATA"
  },
  {
    id: "m3",
    title: "ESCORT CONVOY R-7",
    priority: "SECONDARY",
    status: "PENDING",
    type: "ESCORT",
    threat: "LOW",
    reward: "FUEL CREDIT"
  },
  {
    id: "m4",
    title: "EXTRACT BEACON DATA",
    priority: "SECONDARY",
    status: "FAILED",
    type: "SALVAGE",
    threat: "LOW",
    reward: "COORDINATES"
  }
];
const STATUS_COLORS = {
  ACTIVE: "#00e8ff",
  PENDING: "#ffaa00",
  COMPLETE: "#00ff88",
  FAILED: "#ff3344"
};
const THREAT_COLORS = {
  HIGH: "#ff4444",
  MODERATE: "#ffaa00",
  LOW: "#00ff88"
};
const MissionsPanel = reactExports.memo(function MissionsPanel2() {
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
        children: "▸ ACTIVE MISSIONS"
      }
    ),
    MISSIONS.map((m, i) => {
      const isPrimary = m.priority === "PRIMARY";
      const statusColor = STATUS_COLORS[m.status];
      const threatColor = THREAT_COLORS[m.threat];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `missions.item.${i + 1}`,
          style: {
            padding: "10px 12px",
            border: `1px solid ${m.status === "FAILED" ? "rgba(255,50,60,0.25)" : isPrimary ? "rgba(0,255,200,0.4)" : "rgba(0,220,255,0.18)"}`,
            background: m.status === "FAILED" ? "rgba(20,5,5,0.5)" : isPrimary ? "rgba(0,25,45,0.7)" : "rgba(0,10,25,0.5)",
            marginBottom: 8,
            boxShadow: isPrimary ? "0 0 14px rgba(0,255,200,0.1)" : "none",
            position: "relative"
          },
          children: [
            isPrimary && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 2,
                  height: "100%",
                  background: "#00ffcc",
                  boxShadow: "0 0 8px #00ffcc"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 6,
                  paddingLeft: isPrimary ? 6 : 0
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 2
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontSize: 8,
                                fontFamily: "monospace",
                                color: isPrimary ? "#00ffcc" : "rgba(0,180,255,0.5)",
                                letterSpacing: "0.15em"
                              },
                              children: m.priority
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontSize: 8,
                                fontFamily: "monospace",
                                letterSpacing: "0.1em",
                                color: "rgba(0,200,255,0.6)",
                                border: "1px solid rgba(0,200,255,0.2)",
                                padding: "1px 5px",
                                background: "rgba(0,20,40,0.5)"
                              },
                              children: m.type
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: m.status === "FAILED" ? "rgba(255,80,80,0.7)" : "rgba(0,220,255,0.9)",
                          letterSpacing: "0.08em",
                          fontWeight: isPrimary ? 700 : 500
                        },
                        children: m.title
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: statusColor,
                        letterSpacing: "0.1em",
                        textShadow: `0 0 5px ${statusColor}`,
                        flexShrink: 0,
                        marginLeft: 8
                      },
                      children: m.status
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  gap: 12,
                  paddingLeft: isPrimary ? 6 : 0
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        fontSize: 8,
                        fontFamily: "monospace",
                        color: "rgba(0,180,255,0.4)",
                        letterSpacing: "0.1em"
                      },
                      children: [
                        "THREAT: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: threatColor }, children: m.threat })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        fontSize: 8,
                        fontFamily: "monospace",
                        color: "rgba(0,180,255,0.4)",
                        letterSpacing: "0.1em"
                      },
                      children: [
                        "REWARD:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(0,220,255,0.7)" }, children: m.reward })
                      ]
                    }
                  ),
                  m.timer && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      style: {
                        fontSize: 8,
                        fontFamily: "monospace",
                        color: "rgba(0,180,255,0.4)",
                        letterSpacing: "0.1em"
                      },
                      children: [
                        "T: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffaa00" }, children: m.timer })
                      ]
                    }
                  )
                ]
              }
            )
          ]
        },
        m.id
      );
    })
  ] });
});
export {
  MissionsPanel as default
};
