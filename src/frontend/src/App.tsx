import TacticalStage from "./TacticalStage";

export default function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        // @ts-ignore -- dvh is valid CSS but not in all TS DOM types
        "--app-height": "100dvh",
        overflow: "hidden",
        background: "#000008",
        padding:
          "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
        boxSizing: "border-box" as const,
      }}
    >
      <TacticalStage />
    </div>
  );
}
