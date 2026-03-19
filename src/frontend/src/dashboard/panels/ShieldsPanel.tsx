import { memo } from "react";
import { useDashboardStore } from "../../useDashboardStore";

const DAMAGE_LOG = [
  { time: "04:08:22", source: "METEORITE IMPACT", impact: 3 },
  { time: "04:05:11", source: "PLASMA DISCHARGE", impact: 7 },
  { time: "03:58:44", source: "DEBRIS FIELD", impact: 2 },
];

function SegmentedBar({
  value,
  segments,
  color,
}: { value: number; segments: number; color: string }) {
  const filled = Math.round((value / 100) * segments);
  const segs = Array.from({ length: segments }, (_, i) => i);
  return (
    <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
      {segs.map((i) => (
        <div
          key={`seg-pos-${i}`}
          style={{
            flex: 1,
            height: 10,
            background: i < filled ? color : "rgba(0,100,150,0.2)",
            boxShadow: i < filled ? `0 0 6px ${color}88` : "none",
            border: `0.5px solid ${i < filled ? `${color}44` : "rgba(0,100,150,0.2)"}`,
            transition: "background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

const ShieldsPanel = memo(function ShieldsPanel() {
  const { shipStatus } = useDashboardStore();

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
        ▸ SHIELD SYSTEMS
      </div>

      <div
        style={{
          padding: "10px 12px",
          border: "1px solid rgba(0,220,255,0.2)",
          background: "rgba(0,10,25,0.5)",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.15em",
            }}
          >
            SHIELD INTEGRITY
          </span>
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#00e8ff",
              fontWeight: 700,
            }}
          >
            {shipStatus.shields}%
          </span>
        </div>
        <SegmentedBar value={shipStatus.shields} segments={8} color="#00e8ff" />
        <div
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "rgba(0,180,255,0.4)",
            marginTop: 6,
            letterSpacing: "0.1em",
          }}
        >
          RECHARGE RATE: 0.4%/s — NOMINAL
        </div>
      </div>

      <div
        style={{
          padding: "10px 12px",
          border: "1px solid rgba(0,255,136,0.2)",
          background: "rgba(0,10,25,0.5)",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.15em",
            }}
          >
            HULL INTEGRITY
          </span>
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: shipStatus.hull > 60 ? "#00ff88" : "#ffaa00",
              fontWeight: 700,
            }}
          >
            {shipStatus.hull}%
          </span>
        </div>
        <SegmentedBar
          value={shipStatus.hull}
          segments={8}
          color={shipStatus.hull > 60 ? "#00ff88" : "#ffaa00"}
        />
      </div>

      <div
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          marginBottom: 8,
        }}
      >
        ▸ DAMAGE LOG
      </div>
      {DAMAGE_LOG.map((hit) => (
        <div
          key={hit.time}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 0",
            borderBottom: "1px solid rgba(0,220,255,0.06)",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 8,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.4)",
              letterSpacing: "0.08em",
            }}
          >
            {hit.time}
          </span>
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,220,255,0.7)",
              letterSpacing: "0.08em",
            }}
          >
            {hit.source}
          </span>
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "#ff8888",
              fontWeight: 700,
            }}
          >
            -{hit.impact}%
          </span>
        </div>
      ))}
    </div>
  );
});

export default ShieldsPanel;
