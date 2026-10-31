"use client";

// Isolated into its own file so the three.js / @react-three/fiber bundle is
// only fetched once Hero.tsx dynamic-imports this module client-side — see
// the `dynamic(() => import("./Avatar3DCanvas"), { ssr: false })` call in
// Hero.tsx. Never imported anywhere else.

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Environment, Sphere, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function Avatar3D() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]} scale={hovered ? 1.1 : 1}>
          <MeshDistortMaterial
            color="#ba80ff"
            roughness={0.2}
            metalness={0.8}
            distort={hovered ? 0.4 : 0.2}
            speed={hovered ? 2 : 1}
            envMapIntensity={1.5}
          />
        </Sphere>

        <mesh position={[-0.4, 0.2, 0.9]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="white" roughness={0.1} metalness={0.1} />
        </mesh>
        <mesh position={[0.4, 0.2, 0.9]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="white" roughness={0.1} metalness={0.1} />
        </mesh>

        <mesh position={[-0.4, 0.2, 1.02]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#1d1d1f" roughness={0} metalness={0} />
        </mesh>
        <mesh position={[0.4, 0.2, 1.02]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#1d1d1f" roughness={0} metalness={0} />
        </mesh>

        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 64]} />
          <meshStandardMaterial color="#ba80ff" transparent opacity={0.3} side={2} emissive="#ba80ff" emissiveIntensity={0.5} />
        </mesh>

        {[...Array(20)].map((_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 0.5) * 1.6, Math.cos(i * 0.7) * 1.6, Math.sin(i * 0.3) * 1.6]}
            scale={0.03}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#ba80ff" emissive="#ba80ff" emissiveIntensity={0.5} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function Avatar3DCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, 5]} intensity={0.5} color="#ba80ff" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      <Avatar3D />
    </Canvas>
  );
}
