import { useState } from "react";
import { useTacticalStore } from "./useTacticalStore";

export default function SmokeTestPanel() {
  const [open, setOpen] = useState(false);
  const smokeTestResults = useTacticalStore((s) => s.smokeTestResults);

  if (!smokeTestResults) {
    return (
      <button
        type="button"
        data-ocid="smoke.toggle"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: "clamp(10px, 2vw, 20px)",
          right: "clamp(10px, 2vw, 20px)",
          zIndex: 9999,
          pointerEvents: "auto",
          fontFamily: "monospace",
          fontSize: "10px",
          letterSpacing: "0.1em",
          color: "rgba(0,220,255,0.6)",
          background: "rgba(0,10,30,0.85)",
          border: "1px solid rgba(0,220,255,0.3)",
          padding: "6px 10px",
          cursor: "pointer",
          minHeight: "36px",
          minWidth: "44px",
        }}
      >
        QA
      </button>
    );
  }

  const entries = Object.entries(smokeTestResults);
  const passCount = entries.filter(([, v]) => v).length;
  const allPass = passCount === entries.length;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "clamp(10px, 2vw, 20px)",
        right: "clamp(10px, 2vw, 20px)",
        zIndex: 9999,
        pointerEvents: "auto",
        fontFamily: "monospace",
        fontSize: "clamp(9px, 1vw, 11px)",
      }}
    >
      <button
        type="button"
        data-ocid="smoke.toggle"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "block",
          width: "100%",
          padding: "6px 10px",
          background: allPass ? "rgba(0,40,30,0.9)" : "rgba(40,10,10,0.9)",
          border: `1px solid ${
            allPass ? "rgba(0,220,150,0.5)" : "rgba(255,60,60,0.5)"
          }`,
          color: allPass ? "rgba(0,255,150,0.9)" : "rgba(255,80,80,0.9)",
          cursor: "pointer",
          letterSpacing: "0.1em",
          fontSize: "10px",
          minHeight: "36px",
          textAlign: "left" as const,
        }}
      >
        QA {allPass ? "✓" : "✗"} {passCount}/{entries.length}
      </button>

      {open && (
        <div
          style={{
            marginTop: "2px",
            background: "rgba(0,5,20,0.95)",
            border: "1px solid rgba(0,180,255,0.2)",
            padding: "8px",
            maxHeight: "clamp(200px, 40vh, 350px)",
            overflowY: "auto" as const,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
              paddingBottom: "4px",
              borderBottom: "1px solid rgba(0,180,255,0.15)",
            }}
          >
            <span
              style={{ color: "rgba(0,180,255,0.7)", letterSpacing: "0.15em" }}
            >
              SMOKE TESTS
            </span>
            <button
              type="button"
              data-ocid="smoke.close_button"
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(0,180,255,0.5)",
                cursor: "pointer",
                padding: "0 4px",
                fontSize: "12px",
                lineHeight: 1,
                minHeight: "24px",
                minWidth: "24px",
              }}
            >
              ×
            </button>
          </div>
          {entries.map(([label, pass]) => (
            <div
              key={label}
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "3px",
                color: pass ? "rgba(0,255,150,0.8)" : "rgba(255,80,80,0.9)",
                fontSize: "9px",
                letterSpacing: "0.05em",
              }}
            >
              <span style={{ flexShrink: 0 }}>{pass ? "✓" : "✗"}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
