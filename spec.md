# Tactical Command Interface

## Current State
Full cinematic sci-fi tactical command interface with globe, HUD, cockpit frame, weapon systems, radar, threats, and QA panel. All systems are live. Layer stack has z-index conflicts causing interactive UI to be blocked. Globe has no click-to-target. Weapon deck is functional but lacks a dedicated LAUNCH button. No dedicated left/right cockpit side panels.

## Requested Changes (Diff)

### Add
- Globe click-to-target: onClick on PlanetSphere → lat/lng/sector → globeTarget state
- 3D targeting reticle at clicked location on globe
- LeftPanel: glass-style HUD panel in left cockpit area (Target Data: LAT/LON, Sector, Threat Level, Scan)
- RightPanel: glass-style HUD panel in right cockpit area (Radar, Incoming threats list, System status)
- selectedWeaponId in weapons store + selectWeapon action
- LAUNCH primary fire button in WeaponDeck (red, fires selectedWeapon)
- Event log in tactical store (logs fire events, lock events)
- New cockpit frame image: 7AECA372-28A5-4DD8-AA6A-AC7B24F1D273-1.png

### Modify
- CockpitFrame: new image path + mix-blend-mode: multiply for white-center transparency
- TacticalStage z-index stack: interactive UI above cockpit frame
  - Globe: z:1, HUD decorations: z:10, CockpitAmbientFx: z:12, CockpitFrame: z:15 (pointer-events:none), SideEnclosure: z:8, LeftPanel: z:30, RightPanel: z:30, WeaponDeck: z:35, SmokeTestPanel: z:50, CommandDashboard: z:60
- WeaponDeck: add weapon select mode + red LAUNCH button; glass effect styling
- useTacticalStore: add globeTarget, eventLog state
- PlanetSphere: add onClick prop
- GlobeCore: wire onClick to store, add TargetReticle component
- RadarSystem: moved into RightPanel

### Remove
- Standalone RadarSystem from TacticalStage top level (now inside RightPanel)

## Implementation Plan
1. Update useTacticalStore with globeTarget + eventLog + pushEventLog
2. Update useWeapons with selectedWeaponId + selectWeapon
3. Update PlanetSphere: add onClick → compute lat/lng from intersect point
4. Update GlobeCore: TargetReticle 3D mesh + pass onClick to PlanetSphere
5. Update CockpitFrame: new image, mix-blend-mode: multiply
6. Update TacticalStage: correct z-index stack, add LeftPanel + RightPanel, remove standalone RadarSystem
7. Redesign WeaponDeck: weapon select buttons + LAUNCH button + glass effect
8. Create LeftPanel: target data glass panel
9. Create RightPanel: radar canvas + threats list + system status
