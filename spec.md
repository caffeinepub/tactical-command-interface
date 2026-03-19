# Tactical Command Interface — Stage 3: Command Dashboard

## Current State

- TacticalStage.tsx: scene container with Canvas, HudOverlay, SmokeTestPanel
- GlobeCore.tsx: 3D globe with interactive nodes
- HudOverlay.tsx: SVG decorative overlay + HudReadout
- HudReadout.tsx: TARGET LOCK panel, SIGNAL ANALYSIS stats, SCAN MODE button — all in lower-left
- useTacticalStore.ts: Zustand store with selectedNode, scanMode, nodeData, smokeTestResults
- SmokeTestPanel.tsx: QA pass/fail panel (bottom-right)

## Requested Changes (Diff)

### Add
- `useDashboardStore.ts`: Zustand store — dashboardOpen, activeDashboardTab, shipStatus, alerts, logs
- `CommandDashboard.tsx`: top-level dashboard shell — right-side sliding panel on desktop, full-screen on mobile portrait, split/near-fullscreen on mobile landscape
- `DashboardSidebar.tsx`: vertical tab list (Command, Navigation, Weapons, Shields, Scanner, Engineering, Missions, Alerts, Logs) — cyan glow active state
- `DashboardTopBar.tsx`: ship name, sector name, threat level, status indicators
- `DashboardContent.tsx`: routes to correct panel based on activeDashboardTab
- `panels/CommandPanel.tsx`: current mission, threat level, ship status
- `panels/NavigationPanel.tsx`: heading, sector/grid coords, waypoint, route stability, jump window, anomaly proximity, black hole risk, route status — all mock data
- `panels/WeaponsPanel.tsx`: weapon slots, cooldown bars, status
- `panels/ShieldsPanel.tsx`: shield bar/ring, hull integrity
- `panels/ScannerPanel.tsx`: signal strength, selected target data from useTacticalStore
- `panels/EngineeringPanel.tsx`: power level bar, system load
- `panels/MissionsPanel.tsx`: active objectives list with status badges (active/pending/complete/failed), mission type, threat level, reward, timer — mock data, primary mission highlighted
- `panels/AlertsPanel.tsx`: warning messages list
- `panels/LogsPanel.tsx`: recent actions log
- COMMAND button added to HudReadout.tsx below SCAN MODE — same visual language (cyan glow, glass panel, monospace, same width)

### Modify
- `HudReadout.tsx`: add COMMAND button stacked below SCAN MODE button, same size/style family, opens dashboard via useDashboardStore
- `useTacticalStore.ts`: no changes needed
- `TacticalStage.tsx`: mount CommandDashboard alongside existing HudOverlay and SmokeTestPanel

### Remove
- Nothing removed. SmokeTestPanel untouched.

## Implementation Plan

1. Create `useDashboardStore.ts` with dashboardOpen, activeDashboardTab, shipStatus (mock), alerts (mock array), logs (mock array)
2. Build all panel components with mock data — keep each file small and focused
3. Build DashboardSidebar, DashboardTopBar, DashboardContent
4. Build CommandDashboard shell:
   - Desktop: fixed right-side panel, width ~420px, slides in from right, globe remains visible
   - Mobile portrait (≤600px): position fixed, full-screen (100vw × 100dvh)
   - Mobile landscape (height ≤500px): near-fullscreen, sidebar becomes top tab strip
   - Smooth CSS transform slide animation, no heavy transitions
   - backdrop-filter blur on panel
   - Does NOT use pointer-events on globe canvas
5. Add COMMAND button to HudReadout.tsx — same glass panel style as SCAN MODE, stacked below it
6. Mount CommandDashboard in TacticalStage.tsx
7. Ensure no z-index overlap with SmokeTestPanel (dashboard z-index 50, smoke panel stays at its current level)
8. Validate and fix any TypeScript/lint errors
