import LowerConsoleShell from "./LowerConsoleShell";
import SideFrameDetails from "./SideFrameDetails";
import UpperCanopy from "./UpperCanopy";

function EdgeVignette() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid meet"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="vignette-center"
          cx="50%"
          cy="50%"
          r="60%"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(720, 450) scale(720, 450)"
        >
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="70%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <linearGradient id="vignette-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.28)" />
          <stop offset="20%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="vignette-bottom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="80%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
        </linearGradient>
        <linearGradient id="vignette-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0.32)" />
          <stop offset="12%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <linearGradient id="vignette-right" x1="0" y1="0" x2="1" y2="0">
          <stop offset="88%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="1440"
        height="900"
        fill="url(#vignette-center)"
      />
      <rect x="0" y="0" width="1440" height="900" fill="url(#vignette-top)" />
      <rect
        x="0"
        y="0"
        width="1440"
        height="900"
        fill="url(#vignette-bottom)"
      />
      <rect x="0" y="0" width="1440" height="900" fill="url(#vignette-left)" />
      <rect x="0" y="0" width="1440" height="900" fill="url(#vignette-right)" />
    </svg>
  );
}

export default function CockpitFrame() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 15,
      }}
      aria-hidden="true"
    >
      <EdgeVignette />
      <SideFrameDetails />
      <UpperCanopy />
      <LowerConsoleShell />
    </div>
  );
}
