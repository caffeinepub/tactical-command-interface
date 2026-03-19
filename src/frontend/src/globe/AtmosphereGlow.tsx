import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = `
varying vec3 vNormal;
varying vec3 vViewDir;
uniform float time;
void main() {
  float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.2);
  float pulse = 1.0 + 0.06 * sin(time * 0.5);
  vec3 color = vec3(0.15, 0.55, 1.0);
  gl_FragColor = vec4(color * fresnel * pulse, fresnel * 0.75);
}
`;

export default function AtmosphereGlow() {
  const outerRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame(({ clock }) => {
    if (outerRef.current) {
      outerRef.current.uniforms.time.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {/* Fresnel atmosphere glow */}
      <mesh>
        <sphereGeometry args={[1.72, 48, 48]} />
        <shaderMaterial
          ref={outerRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={{ time: { value: 0 } }}
        />
      </mesh>
      {/* Inner haze */}
      <mesh>
        <sphereGeometry args={[1.58, 48, 48]} />
        <meshBasicMaterial
          color="#0088ff"
          side={THREE.BackSide}
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
