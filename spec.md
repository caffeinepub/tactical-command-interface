# Tactical Command Interface

## Current State
Version 33 live. The app has a full tutorial state machine (8 steps), cinematic intro, story mode Phase 1, ElevenLabs + browser SpeechSynthesis hybrid voice, and a complete combat system. The tutorial "target" globe tap step has had a fix applied in V33 but may have partially regressed. There is no subtitle system. Voice narration timing uses a 350ms delay in TutorialOverlay.

## Requested Changes (Diff)

### Add
- `subtitle/useSubtitleStore.ts` — Zustand store tracking `currentText`, `show(text, ms?)`, `clear()`
- `subtitle/SubtitleStrip.tsx` — fixed cinematic subtitle strip at bottom of screen, auto-dismisses, `pointer-events: none`, fade in/out, safe-area aware
- DOM-level globe tap fallback: `onPointerUp` handler on globe-area container divs in TacticalStage that during the `"target"` tutorial step directly calls `setGlobeTarget()` + `setTargetDetected()` without relying on Three.js raycasting

### Modify
- `GlobeCore.tsx` — In `handleGlobeClick`: add early-return path when `tutorialActive && currentStep === "target"` that bypasses the `isSecondTap` guard completely and always sets a new target + calls `setTargetDetected()`. This prevents the 35° secondTap radius from misfiring during the target tutorial step.
- `PlanetSphere.tsx` — Add `onPointerUp` (in addition to `onClick`) on the sphere mesh to improve iOS touch event reliability. R3F `onClick` can miss on some iOS versions; `onPointerUp` fires more reliably.
- `audio/aegisVoice.ts` — Import `useSubtitleStore` and call `show(text)` at the start of `speak()`. Use `utterance.onend` to call `clear()`. Use `utterance.onerror` to call `clear()`.
- `systems/ElevenVoice.ts` — Import `useSubtitleStore` and call `show(text)` at the start of `speakEleven()`. Use `audio.onended` to call `clear()`. Also update `localSpeak()` fallback inside ElevenVoice to show subtitle (or it inherits from aegisVoice).
- `TacticalStage.tsx` — Mount `SubtitleStrip` once (fixed, not in portrait/landscape-specific JSX). Add `onPointerUp` to the globe-area div in PortraitStage and to the canvas container in LandscapeStage that during `"target"` step sets a default globe target + calls setTargetDetected().
- `tutorial/TutorialOverlay.tsx` — Harden narration timing: always call `stopAllVoice()` at the top of the step-change effect before starting a new timer. Add `clearSubtitle()` call on step change. Ensure the 350ms delay ref is always cleared.

### Remove
- Nothing removed in this pass

## Implementation Plan
1. Create `useSubtitleStore.ts` with show/clear/timer logic
2. Create `SubtitleStrip.tsx` — fixed bottom, cinematic, fade, auto-dismiss
3. Modify `aegisVoice.ts` to show subtitle on speak, clear on utterance end
4. Modify `ElevenVoice.ts` to show subtitle on speakEleven, clear on audio ended
5. Modify `GlobeCore.tsx` handleGlobeClick — bypass isSecondTap during target tutorial step
6. Modify `PlanetSphere.tsx` — add onPointerUp alongside onClick for iOS reliability
7. Modify `TacticalStage.tsx` — DOM globe tap fallback + mount SubtitleStrip
8. Modify `TutorialOverlay.tsx` — call clearSubtitle on step change, harden voice timing
9. Validate: lint + typecheck + build
