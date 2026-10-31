"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.5, 6]} />
        <meshLambertMaterial color="#9a6940" flatShading />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.38, 0.65, 7]} />
        <meshLambertMaterial color="#5ba34d" flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <coneGeometry args={[0.28, 0.5, 7]} />
        <meshLambertMaterial color="#76c45f" flatShading />
      </mesh>
    </group>
  );
}

function Cloud({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.position.x = position[0] + Math.sin(s.clock.elapsedTime * speed) * 0.8;
  });
  return (
    <group ref={ref} position={position}>
      {[[0, 0, 0, 0.42], [0.42, -0.05, 0.05, 0.32], [-0.4, -0.05, 0, 0.3], [0.1, 0.16, 0, 0.3]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 1]} />
          <meshLambertMaterial color="#ffffff" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Island() {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.12;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.1, 1.9, 0.35, 10]} />
        <meshLambertMaterial color="#76c45f" flatShading />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[1.9, 1.7, 0.22, 10]} />
        <meshLambertMaterial color="#9a6940" flatShading />
      </mesh>
      <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.7, 2.2, 8]} />
        <meshLambertMaterial color="#cfc7ba" flatShading />
      </mesh>
      <Tree position={[-1.1, 0.17, 0.5]} scale={1.1} />
      <Tree position={[-0.55, 0.17, -0.95]} scale={0.85} />
      <Tree position={[1.25, 0.17, -0.4]} scale={1.2} />
      <Tree position={[0.7, 0.17, 1.1]} scale={0.7} />
      {/* little house */}
      <group position={[0.1, 0.17, -0.1]}>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.7, 0.56, 0.6]} />
          <meshLambertMaterial color="#f6f1e6" flatShading />
        </mesh>
        <mesh position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.6, 0.42, 4]} />
          <meshLambertMaterial color="#d97a2d" flatShading />
        </mesh>
        <mesh position={[0, 0.16, 0.31]}>
          <boxGeometry args={[0.16, 0.3, 0.02]} />
          <meshLambertMaterial color="#6e4726" />
        </mesh>
      </group>
      <mesh position={[-0.2, 0.22, 1.3]}>
        <icosahedronGeometry args={[0.17, 0]} />
        <meshLambertMaterial color="#cfc7ba" flatShading />
      </mesh>
      <mesh position={[1.6, 0.24, 0.5]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshLambertMaterial color="#f4c34d" flatShading />
      </mesh>
    </group>
  );
}

export default function IslandScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [4.6, 3.2, 6.2], fov: 38 }} gl={{ alpha: true }}>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 3]} intensity={1.6} />
      <Float speed={1.4} rotationIntensity={0.05} floatIntensity={0.7}>
        <Island />
      </Float>
      <Cloud position={[-3.2, 2.6, -1]} speed={0.25} />
      <Cloud position={[3.6, 3.1, -2]} speed={0.2} />
      <Cloud position={[-2.4, -1.6, 1]} speed={0.3} />
    </Canvas>
  );
}
