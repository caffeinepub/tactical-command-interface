import { r as reactExports, j as jsxRuntimeExports } from "./index-Dl7m54fP.js";
const WEAPONS = [
  { name: "PLASMA CANNON MK-II", status: "READY", cooldown: 100 },
  { name: "RAIL GUN ARRAY", status: "READY", cooldown: 100 },
  { name: "MISSILE BATTERY", status: "COOLING", cooldown: 60 },
  { name: "EMP BURST", status: "OFFLINE", cooldown: 0 }
];
const STATUS_COLORS = {
  READY: "#00ff88",
  COOLING: "#ffaa00",
  OFFLINE: "#ff3344"
};
const WeaponsPanel = reactExports.memo(function WeaponsPanel2() {
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
        children: "▸ WEAPONS LOADOUT"
      }
    ),
    WEAPONS.map((w, i) => {
      const color = STATUS_COLORS[w.status];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `weapons.item.${i + 1}`,
          style: {
            padding: "10px 12px",
            border: `1px solid ${w.status === "READY" ? "rgba(0,220,255,0.2)" : w.status === "COOLING" ? "rgba(255,170,0,0.2)" : "rgba(255,50,50,0.2)"}`,
            background: "rgba(0,10,25,0.6)",
            marginBottom: 8
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: "rgba(0,220,255,0.9)",
                        letterSpacing: "0.1em",
                        fontWeight: 600
                      },
                      children: w.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: {
                        fontSize: 9,
                        fontFamily: "monospace",
                        color,
                        letterSpacing: "0.12em",
                        textShadow: `0 0 6px ${color}`
                      },
                      children: w.status
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.4)",
                  marginBottom: 5,
                  letterSpacing: "0.1em"
                },
                children: "COOLDOWN"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  height: 4,
                  background: "rgba(0,100,150,0.3)",
                  border: "0.5px solid rgba(0,220,255,0.15)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      width: `${w.cooldown}%`,
                      background: `linear-gradient(90deg, ${color}66, ${color})`,
                      boxShadow: `0 0 8px ${color}88`,
                      transition: "width 0.5s ease"
                    }
                  }
                )
              }
            )
          ]
        },
        w.name
      );
    })
  ] });
});
export {
  WeaponsPanel as default
};
