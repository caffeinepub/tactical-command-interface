import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { registerMotionLayer } from "./shipMotionEngine";

interface Props {
  factor: number;
  children: ReactNode;
  zIndex?: number;
  style?: CSSProperties;
}

export default function ShipMotionLayer({
  factor,
  children,
  zIndex,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return registerMotionLayer(ref.current, factor);
  }, [factor]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
