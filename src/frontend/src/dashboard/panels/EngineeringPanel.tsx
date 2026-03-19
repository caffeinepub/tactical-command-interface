import { memo } from "react";

interface SystemPower {
  name: string;
  value: number;
  color: string;
}

const SYSTEMS: SystemPower[] = [
  { name: "WEAPONS", value: 72, color: "#ff6644" },
  { name: "SHIELDS", value: 58, color: "#00e8ff" },
  { name: "ENGINES", value: 84, color: "#00ff88" },
  { name: "SENSORS", value: 91, color: "#8080ff" },
  { name: "LIFE SUPPORT", value: 100, color: "#44ffcc" },
];

const EngineeringPanel = memo(function EngineeringPanel() {
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
        ▸ POWER DISTRIBUTION
      </div>

      {SYSTEMS.map((sys) => (
        <div key={sys.name} style={{ marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 10,
              marginBottom: 3,
            }}
          >
            <span
              style={{ color: "rgba(0,220,255,0.7)", letterSpacing: "0.1em" }}
            >
              {sys.name}
            </span>
            <span style={{ color: sys.color, fontWeight: 700 }}>
              {sys.value}%
            </span>
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(0,100,150,0.25)",
              border: "0.5px solid rgba(0,220,255,0.12)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${sys.value}%`,
                background: `linear-gradient(90deg, ${sys.color}55, ${sys.color})`,
                boxShadow: `0 0 6px ${sys.color}66`,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 14,
          borderTop: "1px solid rgba(0,220,255,0.1)",
          paddingTop: 12,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <div
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
                letterSpacing: "0.12em",
                marginBottom: 3,
              }}
            >
              CORE TEMP
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "#00ff88",
                fontWeight: 700,
              }}
            >
              4,200 K
            </div>
            <div
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "#00ff88",
                letterSpacing: "0.1em",
                marginTop: 2,
              }}
            >
              NOMINAL
            </div>
          </div>
          <div
            style={{
              padding: "8px",
              border: "1px solid rgba(255,170,0,0.2)",
              background: "rgba(0,10,25,0.5)",
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.5)",
                letterSpacing: "0.12em",
                marginBottom: 3,
              }}
            >
              ACTIVE WARNINGS
            </div>
            <div
              style={{
                fontSize: 16,
                fontFamily: "monospace",
                color: "#ffaa00",
                fontWeight: 700,
              }}
            >
              1
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.5)",
            letterSpacing: "0.15em",
            marginBottom: 6,
          }}
        >
          SYSTEM LOAD
        </div>
        <div
          style={{
            position: "relative",
            height: 14,
            background: "rgba(0,100,150,0.25)",
            border: "0.5px solid rgba(0,220,255,0.2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "67%",
              background:
                "linear-gradient(90deg, rgba(0,180,255,0.4), rgba(0,220,255,0.7))",
              boxShadow: "0 0 8px rgba(0,200,255,0.4)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              background:
                "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,8,20,0.3) 10px, rgba(0,8,20,0.3) 11px)",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "monospace",
              fontSize: 8,
              color: "rgba(0,220,255,0.8)",
              letterSpacing: "0.1em",
            }}
          >
            67%
          </span>
        </div>
      </div>
    </div>
  );
});

export default EngineeringPanel;
