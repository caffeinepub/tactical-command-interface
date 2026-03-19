import { useEffect, useState } from "react";
import { useThreatStore } from "./combat/useThreatStore";
import type { ThreatStatus } from "./combat/useThreatStore";

const STATUS_LABELS: Partial<Record<ThreatStatus, string>> = {
  INCOMING: "INCOMING OBJECT",
  IMPACT_RISK: "IMPACT RISK",
  PRIORITY_TARGET: "PRIORITY TARGET",
  INTERCEPT_WINDOW: "INTERCEPT WINDOW",
};

const STATUS_COLORS: Partial<Record<ThreatStatus, string>> = {
  INCOMING: "rgba(255,160,0,0.9)",
  IMPACT_RISK: "rgba(255,100,0,0.95)",
  PRIORITY_TARGET: "rgba(255,50,0,0.95)",
  INTERCEPT_WINDOW: "rgba(255,0,0,1.0)",
};

function ThreatWarningBanner() {
  const threats = useThreatStore((s) => s.threats);
  const [pulse, setPulse] = useState(true);

  const activeThreats = threats.filter(
    (t) => t.status !== "DESTROYED" && t.status !== "SURVIVED",
  );

  const worstPriority: ThreatStatus[] = [
    "INTERCEPT_WINDOW",
    "PRIORITY_TARGET",
    "IMPACT_RISK",
    "INCOMING",
  ];
  const worst = worstPriority.find((s) =>
    activeThreats.some((t) => t.status === s),
  );

  useEffect(() => {
    if (!worst) return;
    const interval = setInterval(() => setPulse((p) => !p), 500);
    return () => clearInterval(interval);
  }, [worst]);

  if (!worst || activeThreats.length === 0) return null;

  const label = STATUS_LABELS[worst] ?? worst;
  const color = STATUS_COLORS[worst] ?? "rgba(255,100,0,0.9)";

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 1,
        pointerEvents: "none",
        background: pulse ? "rgba(180,20,0,0.22)" : "rgba(80,8,0,0.15)",
        border: `1px solid ${color}`,
        borderRadius: 2,
        padding: "3px 8px",
        fontFamily: "monospace",
        fontSize: 8,
        letterSpacing: "0.14em",
        color,
        transition: "background 0.25s",
        boxShadow: pulse ? `0 0 12px ${color}, 0 0 4px ${color}` : "none",
        whiteSpace: "nowrap",
      }}
    >
      ⚠ A.E.G.I.S — {label}
    </div>
  );
}

export default function HudOverlay() {
  const W = 1440;
  const H = 900;
  const vb = `0 0 ${W} ${H}`;

  const tl = { x: W * 0.08, y: H * 0.09 };
  const tr = { x: W * 0.92, y: H * 0.09 };
  const tm = { x: W * 0.5, y: H * 0.06 };
  const bl = { x: W * 0.2, y: H * 0.87 };
  const br = { x: W * 0.8, y: H * 0.87 };
  const bm = { x: W * 0.5, y: H * 0.89 };

  const visorPath = [
    `M ${tl.x} ${tl.y}`,
    `Q ${tm.x} ${tm.y} ${tr.x} ${tr.y}`,
    `L ${br.x} ${br.y}`,
    `Q ${bm.x} ${bm.y} ${bl.x} ${bl.y}`,
    "Z",
  ].join(" ");

  const blen = 36;
  const corners = [
    { x: tl.x, y: tl.y, dx: 1, dy: 1, id: "tl" },
    { x: tr.x, y: tr.y, dx: -1, dy: 1, id: "tr" },
    { x: bl.x, y: bl.y, dx: 1, dy: -1, id: "bl" },
    { x: br.x, y: br.y, dx: -1, dy: -1, id: "br" },
  ];

  const tickCount = 60;
  const tickStartX = W * 0.1;
  const tickEndX = W * 0.9;
  const tickY = H * 0.05;
  const tickSpacing = (tickEndX - tickStartX) / (tickCount - 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => ({
    x: tickStartX + i * tickSpacing,
    isMajor: i % 5 === 0,
  }));

  const sideFracs = [0.3, 0.4, 0.5, 0.6, 0.7];
  const visorNotches = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

  return (
    <div
      data-hud
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        filter: "drop-shadow(0 0 6px rgba(0,200,255,0.4))",
      }}
    >
      {/* SVG DECORATIVE LAYER */}
      <svg
        width="100%"
        height="100%"
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        role="img"
        aria-label="Tactical HUD overlay"
      >
        <title>Tactical HUD overlay</title>
        <defs>
          <filter id="hud-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            @keyframes hud-pulse {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
            .hud-pulse { animation: hud-pulse 2.5s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* CROSSHAIRS */}
        <line
          x1="0"
          y1={H * 0.5}
          x2={W}
          y2={H * 0.5}
          stroke="rgba(0,200,255,0.25)"
          strokeWidth="0.5"
          strokeDasharray="3,8"
        />
        <line
          x1={W * 0.5}
          y1="0"
          x2={W * 0.5}
          y2={H}
          stroke="rgba(0,200,255,0.25)"
          strokeWidth="0.5"
          strokeDasharray="3,8"
        />

        {/* VISOR FRAME */}
        <path
          d={visorPath}
          fill="rgba(0,180,255,0.04)"
          stroke="rgba(0,220,255,0.7)"
          strokeWidth="1"
          strokeDasharray="4,3"
          filter="url(#hud-glow)"
        />
        <path
          d={visorPath}
          fill="none"
          stroke="rgba(0,220,255,0.2)"
          strokeWidth="4"
          filter="url(#glow-soft)"
        />

        {/* CORNER BRACKETS */}
        {corners.map((c) => (
          <g
            key={c.id}
            stroke="rgba(0,220,255,0.9)"
            strokeWidth="1.5"
            fill="none"
          >
            <line x1={c.x} y1={c.y} x2={c.x + c.dx * blen} y2={c.y} />
            <line x1={c.x} y1={c.y} x2={c.x} y2={c.y + c.dy * blen} />
          </g>
        ))}

        {/* TICK RULER */}
        <g stroke="rgba(0,220,255,0.6)" strokeWidth="1">
          {ticks.map((tick) => {
            const h = tick.isMajor ? 14 : 7;
            return (
              <line
                key={`tick-${tick.x.toFixed(2)}`}
                x1={tick.x}
                y1={tickY}
                x2={tick.x}
                y2={tickY + h}
                strokeOpacity={tick.isMajor ? 1 : 0.5}
              />
            );
          })}
          <line
            x1={tickStartX}
            y1={tickY}
            x2={tickEndX}
            y2={tickY}
            strokeOpacity={0.4}
          />
        </g>

        {/* SIDE MEASUREMENT LINES */}
        <g stroke="rgba(0,220,255,0.5)" strokeWidth="0.8">
          {sideFracs.map((frac) => (
            <g key={`sidetick-${frac}`}>
              <line
                x1={W * 0.07}
                y1={H * frac}
                x2={W * 0.07 + 12}
                y2={H * frac}
              />
              <line
                x1={W * 0.93}
                y1={H * frac}
                x2={W * 0.93 - 12}
                y2={H * frac}
              />
            </g>
          ))}
        </g>

        {/* HUD TEXT */}
        <g
          fill="rgba(0,220,255,0.6)"
          fontSize="11"
          fontFamily="monospace"
          className="hud-pulse"
        >
          <text x={W * 0.09} y={H * 0.14}>
            TACTICAL OVERLAY v2.4
          </text>
          <text x={W * 0.09} y={H * 0.165} opacity="0.7">
            SYS: ONLINE ██████░░░░
          </text>
          <text x={W * 0.72} y={H * 0.14} textAnchor="start">
            SECTOR ALPHA-7
          </text>
          <text x={W * 0.72} y={H * 0.165} textAnchor="start" opacity="0.7">
            THREAT: NOMINAL
          </text>
        </g>

        {/* VISOR TOP ARC NOTCHES */}
        <g stroke="rgba(0,220,255,0.5)" strokeWidth="1" fill="none">
          {visorNotches.map((f) => {
            const x = W * f;
            const arcY = H * 0.09 - H * 0.03 * (1 - ((f - 0.5) * 2) ** 2);
            return (
              <line
                key={`notch-${f}`}
                x1={x}
                y1={arcY - 8}
                x2={x}
                y2={arcY + 4}
                strokeOpacity="0.6"
              />
            );
          })}
        </g>
      </svg>

      {/* Threat warning banner */}
      <ThreatWarningBanner />
    </div>
  );
}
