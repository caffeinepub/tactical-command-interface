import { useCallback, useState } from "react";
import { useThreatStore } from "../combat/useThreatStore";
import { useWeaponsStore } from "../combat/useWeapons";
import { useTacticalStore } from "../useTacticalStore";
import { runAllSmokeTests } from "./smokeTests";
import { runStressTests } from "./stressTests";
import type {
  GlobalQaSummary,
  QaCategory,
  QaCheckResult,
  QaStatus,
} from "./types";

const STATUS_ICON: Record<QaStatus, string> = {
  PASS: "✓",
  FAIL: "✗",
  SKIP: "—",
  PARTIAL: "~",
  NOT_IMPLEMENTED: "?",
  PENDING: "…",
};

const STATUS_COLOR: Record<QaStatus, string> = {
  PASS: "rgba(0,255,150,0.9)",
  FAIL: "rgba(255,80,80,0.95)",
  SKIP: "rgba(120,140,160,0.6)",
  PARTIAL: "rgba(255,200,50,0.85)",
  NOT_IMPLEMENTED: "rgba(100,120,160,0.7)",
  PENDING: "rgba(100,180,220,0.6)",
};

const CATEGORY_LABELS: Record<QaCategory, string> = {
  UI: "UI / RENDER",
  GAMEPLAY: "GAMEPLAY",
  BACKEND: "BACKEND / REDIS",
  LIVE_DATA: "LIVE DATA",
  RESPONSIVE: "RESPONSIVE",
  AUDIO: "AUDIO",
  PERFORMANCE: "PERFORMANCE",
};

export default function QaPanel() {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState<GlobalQaSummary | null>(null);
  const [stressResults, setStressResults] = useState<QaCheckResult[]>([]);
  const [running, setRunning] = useState(false);
  const [stressRunning, setStressRunning] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  const selectedNode = useTacticalStore((s) => s.selectedNode);
  const scanMode = useTacticalStore((s) => s.scanMode);
  const nodeData = useTacticalStore((s) => s.nodeData);
  const threats = useThreatStore((s) => s.threats);
  const weapons = useWeaponsStore((s) => s.weapons);

  const runTests = useCallback(async () => {
    setRunning(true);
    await new Promise<void>((r) => setTimeout(r, 50));
    const result = runAllSmokeTests({
      selectedNode,
      scanMode,
      nodeData,
      threats,
      weapons,
    });
    setSummary(result);
    setRunning(false);
  }, [selectedNode, scanMode, nodeData, threats, weapons]);

  const runStress = useCallback(async () => {
    setStressRunning(true);
    const results = await runStressTests();
    setStressResults(results);
    setStressRunning(false);
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allStable = summary ? summary.stable : null;
  const hasSummary = !!summary;

  const badgeText = hasSummary
    ? `QA ${allStable ? "✓" : "✗"} P:${summary!.totalPass} F:${summary!.totalFail} S:${summary!.totalSkip}`
    : "QA ◆";

  const btnColor = hasSummary
    ? allStable
      ? "rgba(0,255,150,0.9)"
      : "rgba(255,80,80,0.9)"
    : "rgba(0,180,255,0.6)";

  const btnBg = hasSummary
    ? allStable
      ? "rgba(0,40,30,0.92)"
      : "rgba(40,10,10,0.92)"
    : "rgba(0,10,30,0.88)";

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
        maxWidth: "clamp(260px, 32vw, 380px)",
        width: open ? "clamp(260px, 32vw, 380px)" : "auto",
      }}
    >
      {/* Toggle button */}
      <button
        type="button"
        data-ocid="smoke.toggle"
        onClick={() => {
          if (!open && !hasSummary) runTests();
          setOpen((v) => !v);
        }}
        style={{
          display: "block",
          width: "100%",
          padding: "6px 10px",
          background: btnBg,
          border: `1px solid ${
            hasSummary
              ? allStable
                ? "rgba(0,220,150,0.5)"
                : "rgba(255,60,60,0.5)"
              : "rgba(0,180,255,0.35)"
          }`,
          color: btnColor,
          cursor: "pointer",
          letterSpacing: "0.1em",
          fontSize: "10px",
          minHeight: "36px",
          minWidth: "44px",
          textAlign: "left" as const,
        }}
      >
        {running ? "⟳ RUNNING..." : badgeText}
      </button>

      {open && (
        <div
          style={{
            marginTop: 2,
            background: "rgba(0,5,22,0.97)",
            border: "1px solid rgba(0,180,255,0.22)",
            backdropFilter: "blur(8px)",
            maxHeight: "clamp(60vh, 70vh, 80vh)",
            overflowY: "auto" as const,
            display: "flex",
            flexDirection: "column" as const,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px 6px",
              borderBottom: "1px solid rgba(0,180,255,0.15)",
              position: "sticky" as const,
              top: 0,
              background: "rgba(0,5,22,0.98)",
              zIndex: 1,
            }}
          >
            <span
              style={{
                color: "rgba(0,180,255,0.8)",
                letterSpacing: "0.15em",
                fontSize: 10,
              }}
            >
              TACTICAL QA SYSTEM
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
                fontSize: 14,
                minHeight: 24,
                minWidth: 24,
              }}
            >
              ×
            </button>
          </div>

          {/* Global summary */}
          {hasSummary && (
            <div
              style={{
                padding: "6px 10px",
                borderBottom: "1px solid rgba(0,180,255,0.1)",
                display: "flex",
                gap: 10,
                flexWrap: "wrap" as const,
              }}
            >
              <span
                style={{
                  color: STATUS_COLOR.PASS,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                }}
              >
                ✓ {summary!.totalPass} PASS
              </span>
              <span
                style={{
                  color: STATUS_COLOR.FAIL,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                }}
              >
                ✗ {summary!.totalFail} FAIL
              </span>
              <span
                style={{
                  color: STATUS_COLOR.SKIP,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                }}
              >
                — {summary!.totalSkip} SKIP
              </span>
              <span
                style={{
                  color: summary!.stable
                    ? STATUS_COLOR.PASS
                    : STATUS_COLOR.FAIL,
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  marginLeft: "auto",
                }}
              >
                {summary!.stable ? "◆ STABLE" : "◆ UNSTABLE"}
              </span>
            </div>
          )}

          {/* Sections */}
          {hasSummary &&
            summary!.sections.map((section) => {
              const key = section.section;
              const expanded = expandedSections.has(key);
              const sectionFail = section.failCount > 0;
              const sectionColor = sectionFail
                ? "rgba(255,80,80,0.85)"
                : section.passCount === section.totalCount
                  ? "rgba(0,255,150,0.8)"
                  : "rgba(255,200,50,0.8)";

              return (
                <div
                  key={key}
                  style={{ borderBottom: "1px solid rgba(0,180,255,0.08)" }}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(key)}
                    style={{
                      display: "flex",
                      width: "100%",
                      padding: "5px 10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      alignItems: "center",
                      gap: 6,
                      textAlign: "left" as const,
                    }}
                  >
                    <span
                      style={{
                        color: sectionColor,
                        fontSize: 9,
                        fontFamily: "monospace",
                        letterSpacing: "0.12em",
                        flex: 1,
                      }}
                    >
                      {expanded ? "▾" : "▸"}{" "}
                      {CATEGORY_LABELS[key as QaCategory]}
                    </span>
                    <span style={{ color: STATUS_COLOR.PASS, fontSize: 8 }}>
                      {section.passCount}P
                    </span>
                    {section.failCount > 0 && (
                      <span style={{ color: STATUS_COLOR.FAIL, fontSize: 8 }}>
                        {section.failCount}F
                      </span>
                    )}
                    <span style={{ color: STATUS_COLOR.SKIP, fontSize: 8 }}>
                      {section.skipCount}S
                    </span>
                  </button>

                  {expanded && (
                    <div style={{ paddingBottom: 4 }}>
                      {section.checks.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            display: "flex",
                            flexDirection: "column" as const,
                            padding: "2px 14px 2px 18px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 5,
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                color: STATUS_COLOR[c.status],
                                flexShrink: 0,
                                fontSize: 9,
                              }}
                            >
                              {STATUS_ICON[c.status]}
                            </span>
                            <span
                              style={{
                                color: "rgba(180,210,240,0.75)",
                                fontSize: 8,
                                letterSpacing: "0.04em",
                                lineHeight: 1.4,
                              }}
                            >
                              {c.label}
                            </span>
                          </div>
                          {c.message && (
                            <div
                              style={{
                                color: "rgba(120,150,180,0.55)",
                                fontSize: 7.5,
                                letterSpacing: "0.03em",
                                paddingLeft: 14,
                                lineHeight: 1.3,
                                marginTop: 1,
                              }}
                            >
                              {c.message}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

          {/* Stress test results */}
          {stressResults.length > 0 && (
            <div style={{ borderBottom: "1px solid rgba(0,180,255,0.08)" }}>
              <div
                style={{
                  padding: "5px 10px",
                  color: "rgba(255,200,50,0.8)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                }}
              >
                ▸ STRESS TESTS
              </div>
              {stressResults.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    gap: 5,
                    padding: "2px 14px 2px 18px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: STATUS_COLOR[c.status],
                      flexShrink: 0,
                      fontSize: 9,
                    }}
                  >
                    {STATUS_ICON[c.status]}
                  </span>
                  <div>
                    <div
                      style={{ color: "rgba(180,210,240,0.75)", fontSize: 8 }}
                    >
                      {c.label}
                    </div>
                    {c.message && (
                      <div
                        style={{
                          color: "rgba(120,150,180,0.55)",
                          fontSize: 7.5,
                        }}
                      >
                        {c.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: "8px 10px",
              position: "sticky" as const,
              bottom: 0,
              background: "rgba(0,5,22,0.98)",
              borderTop: "1px solid rgba(0,180,255,0.12)",
            }}
          >
            <button
              type="button"
              onClick={runTests}
              disabled={running}
              style={{
                flex: 1,
                padding: "5px 6px",
                background: "rgba(0,20,40,0.8)",
                border: "1px solid rgba(0,180,255,0.35)",
                color: "rgba(0,200,255,0.85)",
                cursor: running ? "not-allowed" : "pointer",
                fontFamily: "monospace",
                fontSize: 8,
                letterSpacing: "0.1em",
              }}
            >
              {running ? "RUNNING..." : "RUN ALL TESTS"}
            </button>
            <button
              type="button"
              onClick={runStress}
              disabled={stressRunning}
              style={{
                flex: 1,
                padding: "5px 6px",
                background: "rgba(20,10,0,0.8)",
                border: "1px solid rgba(255,140,0,0.35)",
                color: "rgba(255,160,50,0.85)",
                cursor: stressRunning ? "not-allowed" : "pointer",
                fontFamily: "monospace",
                fontSize: 8,
                letterSpacing: "0.1em",
              }}
            >
              {stressRunning ? "STRESS..." : "STRESS TEST"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
