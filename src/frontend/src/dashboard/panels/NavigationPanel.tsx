import { memo, useEffect, useState } from "react";

interface NavField {
  label: string;
  value: string;
  highlight?: boolean;
}

const NAV_DATA: NavField[] = [
  { label: "HEADING", value: "247° NW" },
  { label: "SECTOR / GRID", value: "ALPHA-7 / 14-C" },
  { label: "WAYPOINT", value: "NEXUS STATION — 4.2 AU", highlight: true },
  { label: "ROUTE STABILITY", value: "94% STABLE" },
  { label: "TRAVEL STATE", value: "SUBLIGHT CRUISE" },
  { label: "ANOMALY PROXIMITY", value: "1.8 AU — CLASS II" },
  { label: "BLACK HOLE RISK", value: "LOW — DRIFT 0.003°" },
];

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  return `00:${m}:${s}`;
}

const NavigationPanel = memo(function NavigationPanel() {
  const jumpTimer = useCountdown(512);

  return (
    <div style={{ padding: "14px 14px" }}>
      <div
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 12,
          borderBottom: "1px solid rgba(0,220,255,0.1)",
          paddingBottom: 4,
        }}
      >
        ▸ NAVIGATION DATA
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 10px",
          marginBottom: 14,
        }}
      >
        {NAV_DATA.map((f) => (
          <div
            key={f.label}
            style={{
              padding: "8px",
              border: "1px solid rgba(0,220,255,0.15)",
              background: "rgba(0,10,25,0.5)",
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.5)",
                letterSpacing: "0.15em",
                marginBottom: 3,
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: f.highlight ? "#00ffcc" : "rgba(0,220,255,0.9)",
                letterSpacing: "0.08em",
                fontWeight: f.highlight ? 700 : 400,
              }}
            >
              {f.value}
            </div>
          </div>
        ))}
        <div
          style={{
            padding: "8px",
            border: "1px solid rgba(0,255,120,0.25)",
            background: "rgba(0,20,10,0.5)",
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.15em",
              marginBottom: 3,
            }}
          >
            JUMP WINDOW
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              color: "#00ff88",
              letterSpacing: "0.08em",
              fontWeight: 700,
              textShadow: "0 0 6px #00ff88",
            }}
          >
            T-MINUS {jumpTimer}
          </div>
        </div>
      </div>

      {/* Route indicator */}
      <div
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 8,
        }}
      >
        ▸ ROUTE PATH
      </div>
      <div
        style={{
          padding: "12px",
          border: "1px solid rgba(0,220,255,0.15)",
          background: "rgba(0,10,25,0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            position: "relative",
          }}
        >
          {["ORIGIN", "RELAY-4", "WAYPOINT", "NEXUS"].map((pt, i, arr) => (
            <div
              key={pt}
              style={{
                display: "flex",
                alignItems: "center",
                flex: i < arr.length - 1 ? 1 : "none",
              }}
            >
              <div
                style={{
                  width: i === 2 ? 10 : 7,
                  height: i === 2 ? 10 : 7,
                  borderRadius: "50%",
                  background:
                    i <= 1
                      ? "#00ffcc"
                      : i === 2
                        ? "#00e8ff"
                        : "rgba(0,180,255,0.3)",
                  border: i === 2 ? "1px solid #00e8ff" : "none",
                  boxShadow: i <= 2 ? "0 0 8px rgba(0,220,255,0.6)" : "none",
                  flexShrink: 0,
                }}
              />
              {i < arr.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background:
                      i < 2
                        ? "linear-gradient(90deg, #00ffcc, rgba(0,220,255,0.3))"
                        : "rgba(0,100,150,0.3)",
                    margin: "0 2px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          {["ORIGIN", "RELAY-4", "◉ HERE", "NEXUS"].map((lbl) => (
            <span
              key={lbl}
              style={{
                fontSize: 7,
                fontFamily: "monospace",
                color: lbl === "◉ HERE" ? "#00e8ff" : "rgba(0,180,255,0.4)",
                letterSpacing: "0.08em",
              }}
            >
              {lbl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default NavigationPanel;
