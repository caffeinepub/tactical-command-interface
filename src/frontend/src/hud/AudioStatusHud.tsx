/**
 * AudioStatusHud — V17.2
 *
 * Small panel showing:
 *   • Which audio path is active (ElevenLabs / Browser TTS / Locked / Unavailable)
 *   • TEST VOICE button
 *   • TEST SFX button (plays a short tone via Web Audio API)
 *
 * Placed in the portrait SYSTEM drawer tab and landscape right panel.
 */
import { useState } from "react";
import { speak } from "../audio/aegisVoice";
import { speakEleven } from "../systems/ElevenVoice";

type AudioPath = "elevenlabs" | "browser" | "locked" | "unavailable";

function detectAudioPath(): AudioPath {
  if (typeof window === "undefined") return "unavailable";
  const hasSpeak = "speechSynthesis" in window;
  const hasKey = !!(import.meta.env.VITE_ELEVEN_API_KEY as string | undefined);

  try {
    type WinWithWebkit = { webkitAudioContext: typeof AudioContext };
    const Ctor =
      window.AudioContext ??
      (window as unknown as WinWithWebkit).webkitAudioContext;
    const ctx = new Ctor();
    const locked = ctx.state === "suspended";
    void ctx.close();
    if (locked && !hasSpeak) return "locked";
  } catch {
    return "unavailable";
  }

  if (hasKey) return "elevenlabs";
  if (hasSpeak) return "browser";
  return "unavailable";
}

const PATH_LABELS: Record<AudioPath, { label: string; color: string }> = {
  elevenlabs: { label: "ELEVENLABS ACTIVE", color: "#00ffcc" },
  browser: { label: "BROWSER TTS ACTIVE", color: "#00ccff" },
  locked: { label: "AUDIO LOCKED — TAP TO UNLOCK", color: "#ffaa00" },
  unavailable: { label: "AUDIO UNAVAILABLE", color: "#ff4444" },
};

function playSfxTest() {
  try {
    type WinWithWebkit = { webkitAudioContext: typeof AudioContext };
    const Ctor =
      window.AudioContext ??
      (window as unknown as WinWithWebkit).webkitAudioContext;
    const ctx = new Ctor();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
    setTimeout(() => void ctx.close(), 500);
  } catch {
    /* silent fail */
  }
}

export default function AudioStatusHud() {
  const [path, setPath] = useState<AudioPath>(() => detectAudioPath());
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "testing">("idle");
  const [sfxStatus, setSfxStatus] = useState<"idle" | "testing">("idle");

  const pathInfo = PATH_LABELS[path];

  const handleTestVoice = async () => {
    setVoiceStatus("testing");
    const refreshed = detectAudioPath();
    setPath(refreshed);
    const testLine =
      "A.E.G.I.S. voice systems nominal. Commander, I am online.";
    if (refreshed === "elevenlabs") {
      await speakEleven(testLine);
    } else {
      speak(testLine);
    }
    setTimeout(() => setVoiceStatus("idle"), 4000);
  };

  const handleTestSfx = () => {
    setSfxStatus("testing");
    playSfxTest();
    setTimeout(() => setSfxStatus("idle"), 800);
  };

  const btnStyle = (active: boolean, color: string): React.CSSProperties => ({
    flex: 1,
    padding: "9px 4px",
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: "0.16em",
    fontWeight: 700,
    color: active ? color : "rgba(0,200,255,0.7)",
    background: active ? `${color}18` : "rgba(0,8,20,0.6)",
    border: `1px solid ${active ? `${color}88` : "rgba(0,200,255,0.2)"}`,
    borderRadius: 2,
    cursor: "pointer",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    transition: "all 0.2s",
    minHeight: 36,
  });

  type WinWithWebkit = { webkitAudioContext: unknown };
  const hasWebAudio =
    typeof AudioContext !== "undefined" ||
    typeof (window as unknown as WinWithWebkit).webkitAudioContext !==
      "undefined";

  const capabilityRows: [string, boolean, string][] = [
    [
      "ELEVENLABS",
      !!(import.meta.env.VITE_ELEVEN_API_KEY as string | undefined),
      "#00ffcc",
    ],
    ["BROWSER TTS", "speechSynthesis" in window, "#00ccff"],
    ["WEB AUDIO", hasWebAudio, "#8080ff"],
  ];

  return (
    <div
      style={{
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          color: "rgba(0,180,255,0.5)",
          letterSpacing: "0.2em",
          borderBottom: "1px solid rgba(0,220,255,0.1)",
          paddingBottom: 6,
          marginBottom: 2,
        }}
      >
        ▸ AUDIO STATUS
      </div>

      {/* Active path */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          background: "rgba(0,12,30,0.7)",
          border: `1px solid ${pathInfo.color}44`,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: pathInfo.color,
            boxShadow: `0 0 6px ${pathInfo.color}`,
            flexShrink: 0,
            animation: "audio-pulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: pathInfo.color,
            fontWeight: 700,
          }}
        >
          {pathInfo.label}
        </span>
        <button
          type="button"
          onClick={() => setPath(detectAudioPath())}
          style={{
            marginLeft: "auto",
            fontFamily: "monospace",
            fontSize: 7,
            color: "rgba(0,180,255,0.5)",
            background: "transparent",
            border: "1px solid rgba(0,180,255,0.2)",
            borderRadius: 2,
            cursor: "pointer",
            padding: "2px 6px",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            minHeight: 24,
          }}
        >
          REFRESH
        </button>
      </div>

      {/* Test buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={handleTestVoice}
          disabled={voiceStatus === "testing"}
          style={btnStyle(voiceStatus === "testing", "#00ffcc")}
        >
          {voiceStatus === "testing" ? "● TESTING..." : "▶ TEST VOICE"}
        </button>
        <button
          type="button"
          onClick={handleTestSfx}
          disabled={sfxStatus === "testing"}
          style={btnStyle(sfxStatus === "testing", "#00aaff")}
        >
          {sfxStatus === "testing" ? "● BEEP..." : "▶ TEST SFX"}
        </button>
      </div>

      {/* Capability breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {capabilityRows.map(([name, available, color]) => (
          <div
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 9,
              padding: "4px 0",
              borderBottom: "1px solid rgba(0,220,255,0.06)",
            }}
          >
            <span
              style={{ color: "rgba(0,180,255,0.5)", letterSpacing: "0.12em" }}
            >
              {name}
            </span>
            <span
              style={{
                color: available ? color : "rgba(100,100,100,0.6)",
                letterSpacing: "0.1em",
              }}
            >
              {available ? "AVAILABLE" : "NOT FOUND"}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes audio-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
