export default function CockpitFrame() {
  return (
    <img
      src="/assets/uploads/E00E76F0-023C-41F1-B8B3-EA1835DDD6C6-1-1.png"
      alt=""
      aria-hidden="true"
      onError={() =>
        console.warn("[CockpitFrame] Failed to load cockpit overlay image")
      }
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 20,
        pointerEvents: "none",
        display: "block",
        opacity: 1,
      }}
    />
  );
}
