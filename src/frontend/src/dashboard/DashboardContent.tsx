import { Suspense, lazy, memo } from "react";
import { useDashboardStore } from "../useDashboardStore";

const CommandPanel = lazy(() => import("./panels/CommandPanel"));
const NavigationPanel = lazy(() => import("./panels/NavigationPanel"));
const WeaponsPanel = lazy(() => import("./panels/WeaponsPanel"));
const ShieldsPanel = lazy(() => import("./panels/ShieldsPanel"));
const ScannerPanel = lazy(() => import("./panels/ScannerPanel"));
const EngineeringPanel = lazy(() => import("./panels/EngineeringPanel"));
const MissionsPanel = lazy(() => import("./panels/MissionsPanel"));
const AlertsPanel = lazy(() => import("./panels/AlertsPanel"));
const LogsPanel = lazy(() => import("./panels/LogsPanel"));

function PanelFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontFamily: "monospace",
        fontSize: 11,
        color: "rgba(0,180,255,0.4)",
        letterSpacing: "0.2em",
      }}
    >
      LOADING...
    </div>
  );
}

const DashboardContent = memo(function DashboardContent() {
  const { activeDashboardTab } = useDashboardStore();

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,180,255,0.2) transparent",
      }}
    >
      <Suspense fallback={<PanelFallback />}>
        {activeDashboardTab === "command" && <CommandPanel />}
        {activeDashboardTab === "navigation" && <NavigationPanel />}
        {activeDashboardTab === "weapons" && <WeaponsPanel />}
        {activeDashboardTab === "shields" && <ShieldsPanel />}
        {activeDashboardTab === "scanner" && <ScannerPanel />}
        {activeDashboardTab === "engineering" && <EngineeringPanel />}
        {activeDashboardTab === "missions" && <MissionsPanel />}
        {activeDashboardTab === "alerts" && <AlertsPanel />}
        {activeDashboardTab === "logs" && <LogsPanel />}
      </Suspense>
    </div>
  );
});

export default DashboardContent;
