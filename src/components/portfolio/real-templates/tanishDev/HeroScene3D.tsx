"use client";

// Isolated into its own file so three.js / @react-three/fiber /
// @react-three/postprocessing are only fetched once Hero.tsx dynamic-imports
// this module client-side — see the `dynamic(..., { ssr: false })` call
// there. Never imported anywhere else.

import { useRef, useMemo, type MutableRefObject } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { MousePosition } from "./useMouseParallax";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uNoiseScale;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
      i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
      i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 pos = position;
    float noise = snoise(pos * uNoiseScale + uTime * 0.4);
    float displacement = noise * 0.3;
    vDisplacement = displacement;
    pos += normal * displacement;
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vec3 nNormal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(max(1.0 - max(dot(nNormal, viewDir), 0.0), 0.0), 3.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 1.5);
    vec3 baseColor = uColor * clamp(0.3 + vDisplacement * 1.5, 0.0, 1.0);
    vec3 glowLayer = uGlowColor * fresnel * (0.8 + pulse * 0.4);
    vec3 finalColor = baseColor + glowLayer;
    float alpha = 0.15 + fresnel * 0.7 + pulse * 0.05;
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
  }
`;

const GlassPulseMaterial = shaderMaterial(
  { uTime: 0, uNoiseScale: 1.2, uColor: new THREE.Color("#0033cc"), uGlowColor: new THREE.Color("#00aaff") },
  vertexShader,
  fragmentShader
);
extend({ GlassPulseMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    glassPulseMaterial: React.RefAttributes<THREE.ShaderMaterial> & {
      uTime?: number;
      uNoiseScale?: number;
      uColor?: THREE.Color;
      uGlowColor?: THREE.Color;
      transparent?: boolean;
      side?: THREE.Side;
      depthWrite?: boolean;
    };
  }
}

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const COUNT = 800;
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 2 + 0.5;
    }
    return [positions, sizes];
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#0066FF" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function GlassOrb({ mouseRef }: { mouseRef: MutableRefObject<MousePosition> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 128), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(2.2, 0.02, 8, 120), []);
  const ring2Geo = useMemo(() => new THREE.TorusGeometry(2.8, 0.01, 8, 120), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) (matRef.current as THREE.ShaderMaterial & { uTime: number }).uTime = t;

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
      const targetX = mouseRef.current.y * 0.3;
      const targetY = mouseRef.current.x * 0.3;
      meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2;
      ringRef.current.rotation.z = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.2) * 0.15;
      ring2Ref.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <glassPulseMaterial ref={matRef} transparent side={THREE.FrontSide} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} geometry={ringGeo}>
        <meshBasicMaterial color="#0066FF" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring2Ref} geometry={ring2Geo}>
        <meshBasicMaterial color="#00AAFF" transparent opacity={0.25} />
      </mesh>
      <pointLight position={[3, 3, 3]} color="#0066FF" intensity={4} />
      <pointLight position={[-3, -2, -3]} color="#00AAFF" intensity={2} />
      <ambientLight intensity={0.1} />
    </group>
  );
}

export function HeroScene3D({ mouseRef, inView }: { mouseRef: MutableRefObject<MousePosition>; inView: boolean }) {
  return (
    <Canvas
      frameloop={inView ? "always" : "demand"}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <ParticleField />
      <GlassOrb mouseRef={mouseRef} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} resolutionScale={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
