import { memo } from "react";

interface Mission {
  id: string;
  title: string;
  priority: "PRIMARY" | "SECONDARY";
  status: "ACTIVE" | "PENDING" | "COMPLETE" | "FAILED";
  threat: "HIGH" | "MODERATE" | "LOW";
  reward: string;
  timer?: string;
}

const MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "SECURE SECTOR DELTA",
    priority: "PRIMARY",
    status: "ACTIVE",
    threat: "HIGH",
    reward: "INTEL PACKAGE",
    timer: "14:22",
  },
  {
    id: "m2",
    title: "SCAN ANOMALY CLUSTER",
    priority: "SECONDARY",
    status: "ACTIVE",
    threat: "MODERATE",
    reward: "NAV DATA",
  },
  {
    id: "m3",
    title: "ESCORT CONVOY R-7",
    priority: "SECONDARY",
    status: "PENDING",
    threat: "LOW",
    reward: "FUEL CREDIT",
  },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#00e8ff",
  PENDING: "#ffaa00",
  COMPLETE: "#00ff88",
  FAILED: "#ff3344",
};

const THREAT_COLORS: Record<string, string> = {
  HIGH: "#ff4444",
  MODERATE: "#ffaa00",
  LOW: "#00ff88",
};

const MissionsPanel = memo(function MissionsPanel() {
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
        ▸ ACTIVE MISSIONS
      </div>
      {MISSIONS.map((m, i) => {
        const isPrimary = m.priority === "PRIMARY";
        const statusColor = STATUS_COLORS[m.status];
        const threatColor = THREAT_COLORS[m.threat];
        return (
          <div
            key={m.id}
            data-ocid={`missions.item.${i + 1}`}
            style={{
              padding: "10px 12px",
              border: `1px solid ${isPrimary ? "rgba(0,255,200,0.4)" : "rgba(0,220,255,0.18)"}`,
              background: isPrimary ? "rgba(0,25,45,0.7)" : "rgba(0,10,25,0.5)",
              marginBottom: 8,
              boxShadow: isPrimary ? "0 0 14px rgba(0,255,200,0.1)" : "none",
              position: "relative",
            }}
          >
            {isPrimary && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 2,
                  height: "100%",
                  background: "#00ffcc",
                  boxShadow: "0 0 8px #00ffcc",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 6,
                paddingLeft: isPrimary ? 6 : 0,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 8,
                    fontFamily: "monospace",
                    color: isPrimary ? "#00ffcc" : "rgba(0,180,255,0.5)",
                    letterSpacing: "0.15em",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  {m.priority}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: "rgba(0,220,255,0.9)",
                    letterSpacing: "0.08em",
                    fontWeight: isPrimary ? 700 : 500,
                  }}
                >
                  {m.title}
                </span>
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: statusColor,
                  letterSpacing: "0.1em",
                  textShadow: `0 0 5px ${statusColor}`,
                  flexShrink: 0,
                  marginLeft: 8,
                }}
              >
                {m.status}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                paddingLeft: isPrimary ? 6 : 0,
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                THREAT: <span style={{ color: threatColor }}>{m.threat}</span>
              </span>
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: "rgba(0,180,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                REWARD:{" "}
                <span style={{ color: "rgba(0,220,255,0.7)" }}>{m.reward}</span>
              </span>
              {m.timer && (
                <span
                  style={{
                    fontSize: 8,
                    fontFamily: "monospace",
                    color: "rgba(0,180,255,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  T: <span style={{ color: "#ffaa00" }}>{m.timer}</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default MissionsPanel;
