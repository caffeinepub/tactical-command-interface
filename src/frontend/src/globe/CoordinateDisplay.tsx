import { useTacticalStore } from "../useTacticalStore";

export default function CoordinateDisplay() {
  const coords = useTacticalStore((s) => s.hoveredCoords);

  const formatLat = (v: number) => {
    const sign = v >= 0 ? "+" : "-";
    return `${sign}${Math.abs(v).toFixed(2).padStart(6, "0")}°`;
  };

  const formatLng = (v: number) => {
    const sign = v >= 0 ? "+" : "-";
    return `${sign}${Math.abs(v).toFixed(2).padStart(7, "0")}°`;
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "120px",
        left: "20px",
        background: "rgba(0, 10, 30, 0.75)",
        border: "1px solid rgba(0, 200, 255, 0.25)",
        padding: "8px 12px",
        fontFamily: "monospace",
        fontSize: "11px",
        letterSpacing: "0.08em",
        zIndex: 40,
        pointerEvents: "none",
        opacity: coords ? 1 : 0,
        transition: "opacity 0.2s ease",
        minWidth: "200px",
      }}
    >
      {coords && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "3px",
            }}
          >
            <span style={{ color: "rgba(0,180,220,0.6)", marginRight: "12px" }}>
              LAT
            </span>
            <span style={{ color: "#00ddff" }}>{formatLat(coords.lat)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "3px",
            }}
          >
            <span style={{ color: "rgba(0,180,220,0.6)", marginRight: "12px" }}>
              LON
            </span>
            <span style={{ color: "#00ddff" }}>{formatLng(coords.lng)}</span>
          </div>
          <div
            style={{
              marginTop: "6px",
              paddingTop: "5px",
              borderTop: "1px solid rgba(0,200,255,0.15)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "rgba(0,180,220,0.6)", marginRight: "12px" }}>
              SECTOR
            </span>
            <span style={{ color: "#00ddff", fontSize: "10px" }}>
              {coords.sector}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
