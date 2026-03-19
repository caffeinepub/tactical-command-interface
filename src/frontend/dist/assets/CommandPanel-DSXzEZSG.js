import { r as reactExports, u as useDashboardStore, j as jsxRuntimeExports } from "./index-Q-pEkA7Z.js";
function StatusDot({ color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 5px ${color}`,
        flexShrink: 0
      }
    }
  );
}
function StatRow({
  label,
  value,
  pct,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 10 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 10,
          marginBottom: 3
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(0,180,255,0.5)", letterSpacing: "0.12em" }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: value })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          height: 3,
          background: "rgba(0,100,150,0.3)",
          border: "0.5px solid rgba(0,220,255,0.15)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              height: "100%",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}80, ${color})`,
              boxShadow: `0 0 6px ${color}`,
              transition: "width 0.5s ease"
            }
          }
        )
      }
    )
  ] });
}
const SYSTEMS = [
  { label: "WEAPONS", status: "ONLINE", color: "#00ff88" },
  { label: "SHIELDS", status: "REDUCED", color: "#ffaa00" },
  { label: "DRIVES", status: "NOMINAL", color: "#00ff88" },
  { label: "COMMS", status: "ACTIVE", color: "#00e8ff" }
];
const CommandPanel = reactExports.memo(function CommandPanel2() {
  const { shipStatus } = useDashboardStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "14px 14px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          padding: "10px 12px",
          border: "1px solid rgba(0,255,200,0.35)",
          background: "rgba(0,20,40,0.6)",
          boxShadow: "0 0 14px rgba(0,255,200,0.1)",
          marginBottom: 14
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 9,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.5)",
                letterSpacing: "0.2em",
                marginBottom: 4
              },
              children: "▸ PRIMARY OBJECTIVE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontSize: 12,
                fontFamily: "monospace",
                color: "#00ffcc",
                letterSpacing: "0.12em",
                fontWeight: 700,
                textShadow: "0 0 8px #00ffcc",
                marginBottom: 6
              },
              children: "OBJECTIVE DELTA-9 — SECURE PERIMETER"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: {
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.5)",
                  letterSpacing: "0.12em"
                },
                children: [
                  "TYPE: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(0,220,255,0.8)" }, children: "RECON" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                style: {
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.5)",
                  letterSpacing: "0.12em"
                },
                children: [
                  "THREAT: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffaa00" }, children: "ELEVATED" })
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: 14 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: 8,
            borderBottom: "1px solid rgba(0,220,255,0.1)",
            paddingBottom: 4
          },
          children: "▸ SHIP STATUS"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatRow,
        {
          label: "HULL INTEGRITY",
          value: `${shipStatus.hull}%`,
          pct: shipStatus.hull,
          color: shipStatus.hull > 60 ? "#00ff88" : "#ffaa00"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatRow,
        {
          label: "SHIELD LEVEL",
          value: `${shipStatus.shields}%`,
          pct: shipStatus.shields,
          color: "#00e8ff"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatRow,
        {
          label: "POWER OUTPUT",
          value: `${shipStatus.power}%`,
          pct: shipStatus.power,
          color: "#8080ff"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatRow,
        {
          label: "VELOCITY",
          value: `${shipStatus.speed.toFixed(2)}c`,
          pct: shipStatus.speed * 100,
          color: "rgba(0,220,255,0.8)"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.2em",
            marginBottom: 8,
            borderBottom: "1px solid rgba(0,220,255,0.1)",
            paddingBottom: 4
          },
          children: "▸ SYSTEM STATUS"
        }
      ),
      SYSTEMS.map((sys) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 0",
            borderBottom: "1px solid rgba(0,220,255,0.06)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { color: sys.color }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  flex: 1,
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "rgba(0,220,255,0.8)",
                  letterSpacing: "0.12em"
                },
                children: sys.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: sys.color,
                  letterSpacing: "0.1em"
                },
                children: sys.status
              }
            )
          ]
        },
        sys.label
      ))
    ] })
  ] });
});
export {
  CommandPanel as default
};
