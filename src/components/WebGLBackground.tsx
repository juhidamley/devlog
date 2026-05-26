"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += 0.5000 * noise(p); p *= 2.1;
    v += 0.2500 * noise(p); p *= 2.1;
    v += 0.1250 * noise(p); p *= 2.1;
    v += 0.0625 * noise(p);
    return v;
  }

  // 4×4 ordered Bayer dithering (GLSL-safe: no dynamic array indexing)
  float bayer(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int i = x + y * 4;
    if (i ==  0) return  0.0 / 16.0;
    if (i ==  1) return  8.0 / 16.0;
    if (i ==  2) return  2.0 / 16.0;
    if (i ==  3) return 10.0 / 16.0;
    if (i ==  4) return 12.0 / 16.0;
    if (i ==  5) return  4.0 / 16.0;
    if (i ==  6) return 14.0 / 16.0;
    if (i ==  7) return  6.0 / 16.0;
    if (i ==  8) return  3.0 / 16.0;
    if (i ==  9) return 11.0 / 16.0;
    if (i == 10) return  1.0 / 16.0;
    if (i == 11) return  9.0 / 16.0;
    if (i == 12) return 15.0 / 16.0;
    if (i == 13) return  7.0 / 16.0;
    if (i == 14) return 13.0 / 16.0;
                 return  5.0 / 16.0;
  }

  void main() {
    float t = uTime * 0.04;

    // Two-layer animated noise
    float n  = fbm(vUv * 3.0 + vec2(t * 0.5,  t * 0.3));
    n       += 0.35 * fbm(vUv * 7.0 - vec2(t * 0.2, t * 0.6));
    n = clamp(n, 0.0, 1.0);

    // 3-px-group dithering for a chunky retro feel
    float threshold = bayer(gl_FragCoord.xy / 3.0);
    float d = step(threshold, n * 0.52);

    // Sparse twinkling stars
    float sh = hash(floor(vUv * 280.0));
    float star = step(0.986, sh) * (0.5 + 0.5 * sin(sh * 94.0 + uTime * 2.8));

    // Very dark palette — nearly black, neon blocks are the show
    vec3 cDark   = vec3(0.030, 0.030, 0.060);
    vec3 cAccent = vec3(0.038, 0.038, 0.072);
    vec3 cStar   = vec3(0.60,  0.70,  1.00);

    vec3 color = mix(cDark, cAccent, d * 0.5);
    color += cStar * star * 0.28;

    // Subtle scanlines
    color *= 0.96 + 0.04 * step(0.5, fract(gl_FragCoord.y * 0.5));

    // Vignette — stronger to darken edges
    vec2 vig = vUv - 0.5;
    color *= 1.0 - dot(vig, vig) * 1.6;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function DitheredPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      {/* 2×2 plane in clip space — covers viewport regardless of camera */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function WebGLBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: false }}
        camera={{ near: 0.1, far: 10, position: [0, 0, 1] }}
        style={{ background: "#080810" }}
      >
        <DitheredPlane />
      </Canvas>
    </div>
  );
}
