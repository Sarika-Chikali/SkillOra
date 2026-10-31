"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Points, PointMaterial, Preload, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

const BASE = "/templates/devpc";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span style={{ color: "#f1f1f1", fontWeight: 800, fontSize: 14 }}>{progress.toFixed(0)}%</span>
    </Html>
  );
}

function Computers({ isMobile }: { isMobile: boolean }) {
  const computer = useGLTF(`${BASE}/desktop_pc/scene.gltf`);
  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
}

export function ComputersCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 500px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return (
    <Canvas frameloop="demand" shadows dpr={[1, 2]} camera={{ position: [20, 3, 5], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<Loader />}>
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}

function makeLabelTexture(label: string) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff8eb";
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#151030";
  g.textAlign = "center";
  g.textBaseline = "middle";
  let size = 56;
  g.font = `800 ${size}px Poppins, system-ui, sans-serif`;
  while (g.measureText(label).width > 210 && size > 18) {
    size -= 4;
    g.font = `800 ${size}px Poppins, system-ui, sans-serif`;
  }
  g.fillText(label, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Ball({ label }: { label: string }) {
  const map = useMemo(() => makeLabelTexture(label), [label]);
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} map={map} />
      </mesh>
    </Float>
  );
}

export function BallCanvas({ label }: { label: string }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <OrbitControls enableZoom={false} />
        <Ball label={label} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}

function Earth() {
  const earth = useGLTF(`${BASE}/planet/scene.gltf`);
  return <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
}

export function EarthCanvas() {
  return (
    <Canvas shadows frameloop="demand" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }} camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}>
      <Suspense fallback={<Loader />}>
        <OrbitControls autoRotate enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <Earth />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = 1.2 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial transparent color="#f272c8" size={0.002} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

export function StarsCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <Suspense fallback={null}>
        <Stars />
      </Suspense>
    </Canvas>
  );
}
