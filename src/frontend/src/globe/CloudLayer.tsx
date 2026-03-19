import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

interface CloudLayerProps {
  cloudTexture: THREE.CanvasTexture;
}

export default function CloudLayer({ cloudTexture }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.00012;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.56, 48, 48]} />
      <meshStandardMaterial
        alphaMap={cloudTexture}
        color="#e8f4ff"
        transparent
        opacity={0.38}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
