import { memo } from "react";
import { useTacticalStore } from "../../useTacticalStore";

function DataBar({
  label,
  value,
  color,
}: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 10,
          marginBottom: 4,
        }}
      >
        <span style={{ color: "rgba(0,180,255,0.5)", letterSpacing: "0.12em" }}>
          {label}
        </span>
        <span style={{ color, fontWeight: 700 }}>
          {value.toString().padStart(3, "0")}
        </span>
      </div>
      <div
        style={{
          height: 5,
          background: "rgba(0,100,150,0.3)",
          border: "0.5px solid rgba(0,220,255,0.15)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: `0 0 8px ${color}88`,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

const ScannerPanel = memo(function ScannerPanel() {
  const { selectedNode, nodeData } = useTacticalStore();

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
        ▸ SCANNER ARRAY
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
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
            SCAN RANGE
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: "rgba(0,220,255,0.9)",
              fontWeight: 700,
            }}
          >
            2,400 KM
          </div>
        </div>
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
            FREQUENCY
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: "rgba(0,220,255,0.9)",
              fontWeight: 700,
            }}
          >
            7.4 GHz
          </div>
        </div>
      </div>

      {!selectedNode && (
        <div
          data-ocid="scanner.empty_state"
          style={{
            padding: "24px",
            border: "1px solid rgba(0,220,255,0.1)",
            background: "rgba(0,10,25,0.4)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.3)",
              letterSpacing: "0.2em",
            }}
          >
            NO TARGET LOCKED
          </div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.2)",
              letterSpacing: "0.12em",
              marginTop: 4,
            }}
          >
            SELECT A NODE ON THE TACTICAL GLOBE
          </div>
        </div>
      )}

      {selectedNode && nodeData && (
        <div>
          <div
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,180,255,0.5)",
              letterSpacing: "0.2em",
              marginBottom: 8,
            }}
          >
            ▸ TARGET ANALYSIS
          </div>
          <div
            style={{
              padding: "10px 12px",
              border: "1px solid rgba(0,255,200,0.3)",
              background: "rgba(0,20,40,0.5)",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(0,180,255,0.5)",
                letterSpacing: "0.15em",
                marginBottom: 2,
              }}
            >
              TARGET ID
            </div>
            <div
              style={{
                fontSize: 13,
                fontFamily: "monospace",
                color: "#00ffcc",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textShadow: "0 0 8px #00ffcc",
              }}
            >
              {selectedNode}
            </div>
          </div>
          <DataBar
            label="ENERGY OUTPUT"
            value={nodeData.energy}
            color="#00ccff"
          />
          <DataBar
            label="SIGNAL STRENGTH"
            value={nodeData.signal}
            color="#40ffcc"
          />
          <DataBar
            label="STABILITY INDEX"
            value={nodeData.stability}
            color="#8080ff"
          />
        </div>
      )}
    </div>
  );
});

export default ScannerPanel;
