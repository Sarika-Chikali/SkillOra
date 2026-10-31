"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import type { Group } from "three";

function Planet({ scale }: { scale: number }) {
  const group = useRef<Group>(null);
  const ring = useRef<Group>(null);
  const moon = useRef<Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x += (state.pointer.y * 0.25 - group.current.rotation.x) * 0.04;
    }
    if (ring.current) ring.current.rotation.z += delta * 0.05;
    if (moon.current) moon.current.rotation.y += delta * 0.6;
  });
  return (
    <group ref={group} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial color="#f2f2f0" roughness={0.55} metalness={0} clearcoat={0.3} clearcoatRoughness={0.6} />
      </mesh>
      <group rotation={[1.25, 0.25, -0.55]} ref={ring}>
        <mesh castShadow>
          <torusGeometry args={[1.75, 0.035, 48, 256]} />
          <meshStandardMaterial color="#d4a63c" metalness={1} roughness={0.18} envMapIntensity={1.6} />
        </mesh>
      </group>
      <group ref={moon} position={[0, 0, 0]}>
        <mesh position={[-0.42, 0.28, 1.1]} castShadow>
          <sphereGeometry args={[0.21, 48, 48]} />
          <meshStandardMaterial color="#e2b84a" metalness={1} roughness={0.22} envMapIntensity={1.8} />
        </mesh>
      </group>
    </group>
  );
}

export default function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, -10], fov: 17.5, near: 1, far: 20 }}>
      <ambientLight intensity={0.5} />
      <Float speed={0.5}>
        <Planet scale={isMobile ? 0.45 : 1} />
      </Float>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 4, 1]}>
          <Lightformer form="circle" intensity={2} position={[0, 5, -9]} scale={10} />
          <Lightformer form="circle" intensity={2} position={[0, 3, 1]} scale={10} />
          <Lightformer form="circle" intensity={2} position={[-5, -1, -1]} scale={10} />
          <Lightformer form="circle" intensity={2} position={[10, 1, 0]} scale={16} />
        </group>
      </Environment>
    </Canvas>
  );
}
