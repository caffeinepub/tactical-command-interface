import { useEffect, useState } from "react";
import { useSubtitleStore } from "./useSubtitleStore";

export default function SubtitleStrip() {
  const text = useSubtitleStore((s) => s.text);
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setDisplayText(text);
      setVisible(true);
    } else {
      setVisible(false);
      const t = setTimeout(() => setDisplayText(null), 300);
      return () => clearTimeout(t);
    }
  }, [text]);

  if (!displayText) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "max(28px, env(safe-area-inset-bottom, 28px))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9998,
        pointerEvents: "none",
        maxWidth: "min(680px, 88vw)",
        width: "max-content",
        padding: "10px 22px",
        borderRadius: 4,
        background: "rgba(0, 4, 18, 0.82)",
        border: "1px solid rgba(0, 220, 255, 0.35)",
        boxShadow:
          "0 0 12px rgba(0, 200, 255, 0.18), inset 0 0 8px rgba(0, 100, 180, 0.08)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
        backdropFilter: "blur(8px)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "monospace",
          fontSize: "clamp(12px, 1.4vw, 14px)",
          letterSpacing: "0.06em",
          lineHeight: 1.5,
          color: "rgba(220, 240, 255, 0.92)",
          textShadow: "0 0 8px rgba(0, 200, 255, 0.6)",
          textAlign: "center",
        }}
      >
        {displayText}
      </p>
    </div>
  );
}
