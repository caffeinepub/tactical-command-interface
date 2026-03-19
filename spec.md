# Tactical Command Interface — Globe Cinematic Upgrade

## Current State

The globe is rendered in `GlobeCore.tsx` as a single procedural canvas-textured sphere with a basic `meshStandardMaterial`. It has an `AtmosphereShell` using `meshBasicMaterial` on BackSide, a hex overlay, equatorial ring, scan sweep, polar accents, and node markers. The lighting in `TacticalStage.tsx` is basic ambient + two directional/point lights with no intentional day/night side. There is no cloud layer, no custom GLSL shaders, no coordinate readout, and no sector system. `useGlobeControls.ts` already provides orbit + turret modes with smooth damping.

## Requested Changes (Diff)

### Add
- `globe/globeTextures.ts` — factory for procedural day texture, night-lights texture, cloud texture, and hex overlay texture (all canvas-based, mobile-safe)
- `globe/PlanetSphere.tsx` — sphere with custom GLSL `ShaderMaterial` blending day and night textures based on sun direction (terminator line via smoothstep). Uniforms: `dayTexture`, `nightTexture`, `sunDirection`, `time`.
- `globe/CloudLayer.tsx` — slightly larger sphere (r=1.56) using `meshStandardMaterial` with cloud canvas texture, transparent, slow auto-rotation around Y axis at different speed from base planet
- `globe/AtmosphereGlow.tsx` — outer sphere (r=1.72) with custom GLSL fresnel shader: blue rim glow stronger at edges, subtle fade, additive blending, `BackSide` render, lightweight
- `globe/SectorSystem.tsx` — divides globe into ~12 named sectors (canvas-painted highlight zones on a sphere shell), hover detection via raycasting from camera, active sector highlighted in cyan, sector name displayed in readout. Integrates with `useTacticalStore` selected node.
- `globe/CoordinateDisplay.tsx` — HTML overlay (absolute positioned inside TacticalStage, not inside Canvas) showing current LAT/LON from mouse hover on globe sphere. Uses raycasting via `useThree` + `onPointerMove` on globe mesh. Also shows dynamic sector name.
- Enhanced sun directional light in `TacticalStage.tsx` — single strong `directionalLight` from fixed sun position `[5, 2, 3]` intensity 1.8 color `#fff5e0`, reduced ambient to `0.08`, remove old point lights, add subtle blue fill light from opposite side

### Modify
- `GlobeCore.tsx` — refactor to compose new sub-components. Replace `GlobeBody` with `PlanetSphere`. Replace `AtmosphereShell` + `RimGlow` with new `AtmosphereGlow`. Add `CloudLayer`. Add `SectorSystem`. Keep existing `HexShell`, `EquatorialRing`, `ScanSweep`, `PolarAccent`, `EnergyHotspot`, `NodeMarkers` unchanged. Export a `onGlobePointerMove` handler for coordinate tracking.
- `TacticalStage.tsx` — update lighting, mount `CoordinateDisplay` as HTML sibling of `HudOverlay`

### Remove
- Old `AtmosphereShell` and `RimGlow` inline components inside `GlobeCore.tsx` (replaced by `AtmosphereGlow`)
- Old `GlobeBody` inline component (replaced by `PlanetSphere`)
- Old `usePlanetTexture` and `useEmissiveMap` hooks inside `GlobeCore.tsx` (moved to `globeTextures.ts`)

## Implementation Plan

1. Create `globe/globeTextures.ts` — export `buildDayTexture()`, `buildNightTexture()`, `buildCloudTexture()`, `buildHexTexture()` (move hex builder from GlobeCore here). Day texture: blue/teal continents with energy glow. Night texture: black base + glowing city-light dots in warm amber/white, concentrated in continent regions.
2. Create `globe/PlanetSphere.tsx` — `ShaderMaterial` with vertex shader passing `vNormal`, `vUv`. Fragment shader samples dayTexture, nightTexture, blends with `smoothstep(-0.1, 0.2, dot(vNormal, sunDir))`. Animate slight emissive shimmer on day side via `time` uniform.
3. Create `globe/AtmosphereGlow.tsx` — `ShaderMaterial` on `r=1.72` sphere, `side=BackSide`, `transparent`, `blending=AdditiveBlending`. Fresnel: `pow(1.0 - dot(vNormal, vViewDir), 3.0)` → blue glow `rgb(0.2, 0.6, 1.0)` with alpha scaled by fresnel.
4. Create `globe/CloudLayer.tsx` — `r=1.56` sphere, `meshStandardMaterial`, `transparent opacity=0.35`, `alphaMap` from `buildCloudTexture()`, auto-rotates `+0.00015 rad/frame`.
5. Create `globe/SectorSystem.tsx` — defines 12 sectors as `{name, latRange, lngRange}`. On hover (pointer move on an invisible detection sphere), maps UV → lat/lon → sector. Highlights active sector with a faint canvas-texture quad on the sphere. Dispatches sector name to a zustand atom.
6. Create `globe/CoordinateDisplay.tsx` — React HTML div, positioned bottom-left of canvas area, shows `LAT: xx.xx° / LON: xx.xx°` and `SECTOR: [name]` from zustand. Styled in monospace cyan, matching existing HUD style.
7. Update `GlobeCore.tsx` — compose all new sub-components, keep NodeMarkers, add pointer event forwarding.
8. Update `TacticalStage.tsx` — new lighting setup, mount `CoordinateDisplay`.
9. Validate — lint, typecheck, build.
