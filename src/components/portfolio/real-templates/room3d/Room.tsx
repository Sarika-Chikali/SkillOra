"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

type Pick = "about" | "skills" | "projects" | "experience";

function Desk({ onPick, night }: { onPick: (p: Pick) => void; night: boolean }) {
  const [hover, setHover] = useState<string | null>(null);
  const screenColor = night ? "#8a6bff" : "#5b47d6";
  const over = (name: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHover(name);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    setHover(null);
    document.body.style.cursor = "";
  };
  return (
    <group position={[0, 0, -1.9]}>
      {/* desk */}
      <RoundedBox args={[2.8, 0.09, 1.15]} radius={0.03} position={[0, 0.8, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#b98a5c" roughness={0.6} />
      </RoundedBox>
      {[[-1.3, -0.5], [1.3, -0.5], [-1.3, 0.5], [1.3, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.4, z]} castShadow>
          <boxGeometry args={[0.08, 0.8, 0.08]} />
          <meshStandardMaterial color="#2a2438" />
        </mesh>
      ))}
      {/* monitor */}
      <group position={[0, 0.85, -0.15]} onPointerOver={over("monitor")} onPointerOut={out} onClick={() => onPick("about")}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 0.05, 32]} />
          <meshStandardMaterial color="#1c1a26" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.07, 0.5, 0.07]} />
          <meshStandardMaterial color="#1c1a26" />
        </mesh>
        <RoundedBox args={[1.5, 0.9, 0.07]} radius={0.04} position={[0, 0.85, 0]} castShadow>
          <meshStandardMaterial color="#14121c" />
        </RoundedBox>
        <mesh position={[0, 0.85, 0.04]}>
          <planeGeometry args={[1.38, 0.78]} />
          <meshStandardMaterial color={hover === "monitor" ? "#a08bff" : screenColor} emissive={screenColor} emissiveIntensity={night ? 1.4 : 0.6} />
        </mesh>
        {[0.28, 0.14, 0, -0.14, -0.28].map((y, i) => (
          <mesh key={i} position={[-0.25 + i * 0.05, 0.85 + y, 0.05]}>
            <planeGeometry args={[0.6 + (i % 3) * 0.25, 0.035]} />
            <meshBasicMaterial color="#e9e4ff" />
          </mesh>
        ))}
      </group>
      {/* keyboard + mouse */}
      <mesh position={[0, 0.86, 0.3]} castShadow onPointerOver={over("kb")} onPointerOut={out} onClick={() => onPick("skills")}>
        <boxGeometry args={[0.8, 0.03, 0.26]} />
        <meshStandardMaterial color={hover === "kb" ? "#8ea0ff" : "#d9d6e8"} />
      </mesh>
      <mesh position={[0.6, 0.86, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.035, 0.15]} />
        <meshStandardMaterial color="#d9d6e8" />
      </mesh>
      {/* mug */}
      <mesh position={[-1.0, 0.89, 0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.14, 24]} />
        <meshStandardMaterial color="#ff8a5c" />
      </mesh>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0.15, 0, -0.85]} rotation={[0, 0.35, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.09, 32]} />
        <meshStandardMaterial color="#4a3cd6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, -0.32]} castShadow>
        <boxGeometry args={[0.66, 0.7, 0.08]} />
        <meshStandardMaterial color="#4a3cd6" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.05, 5]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

function Shelf({ onPick }: { onPick: (p: Pick) => void }) {
  const books = ["#ff6b81", "#ffd166", "#4cc9f0", "#7b6cff", "#06d6a0", "#ef476f", "#f8961e", "#90be6d"];
  return (
    <group position={[-2.85, 0, -0.4]} rotation={[0, Math.PI / 2, 0]} onClick={() => onPick("projects")}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.6, 2.4, 0.4]} />
        <meshStandardMaterial color="#5c4432" />
      </mesh>
      {[0.35, 1.0, 1.65].map((y, r) => (
        <group key={r} position={[0, y, 0.05]}>
          <mesh position={[0, 0.15, 0.1]}>
            <boxGeometry args={[1.5, 0.5, 0.3]} />
            <meshStandardMaterial color="#3a2b1f" />
          </mesh>
          {books.slice(0, 7).map((c, i) => (
            <mesh key={i} position={[-0.6 + i * 0.18, 0.2 + ((i + r) % 3) * 0.02, 0.15]} castShadow>
              <boxGeometry args={[0.13, 0.34 + ((i * 3 + r) % 4) * 0.03, 0.22]} />
              <meshStandardMaterial color={books[(i + r * 2) % books.length]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Plant() {
  const ref = useRef<Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.8) * 0.02;
  });
  return (
    <group position={[2.2, 0, -2.3]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.2, 0.5, 24]} />
        <meshStandardMaterial color="#d9673c" />
      </mesh>
      <group ref={ref}>
        {[[0, 0.85, 0, 0.32], [0.18, 1.1, 0.05, 0.24], [-0.16, 1.05, -0.06, 0.26], [0.02, 1.32, 0, 0.2]].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={i % 2 ? "#3fae5a" : "#2f9a4c"} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Lamp({ night }: { night: boolean }) {
  return (
    <group position={[-1.1, 0.845, -2.15]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.05, 20]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.04, 0.6, 0.05]}>
        <coneGeometry args={[0.16, 0.2, 24, 1, true]} />
        <meshStandardMaterial color="#ffd166" side={2} emissive="#ffb703" emissiveIntensity={night ? 1.5 : 0.1} />
      </mesh>
      {night && <pointLight position={[0.05, 0.55, 0.1]} intensity={2.2} distance={4.5} color="#ffcf70" castShadow />}
    </group>
  );
}

function Frames({ onPick }: { onPick: (p: Pick) => void }) {
  const colors = ["#ff6b81", "#4cc9f0", "#ffd166"];
  return (
    <group>
      {colors.map((c, i) => (
        <group key={i} position={[-1.3 + i * 1.2, 2.25 - (i % 2) * 0.35, -2.97]} onClick={() => onPick("experience")}>
          <mesh>
            <boxGeometry args={[0.8, 0.56, 0.04]} />
            <meshStandardMaterial color="#1c1a26" />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[0.7, 0.46]} />
            <meshStandardMaterial color={c} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({ night, onPick }: { night: boolean; onPick: (p: Pick) => void }) {
  return (
    <>
      <color attach="background" args={[night ? "#0f0b1e" : "#2d2359"]} />
      <ambientLight intensity={night ? 0.22 : 0.85} />
      <directionalLight position={[4, 6, 3]} intensity={night ? 0.15 : 1.4} castShadow shadow-mapSize={[1024, 1024]} />
      {/* floor + walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#c9b7a1" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, -3]} receiveShadow>
        <boxGeometry args={[6, 3, 0.1]} />
        <meshStandardMaterial color="#6f5bd6" />
      </mesh>
      <mesh position={[-3, 1.5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 3, 6]} />
        <meshStandardMaterial color="#5a47c2" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.012, 0.4]} receiveShadow>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial color="#ef8fa4" />
      </mesh>
      <Desk onPick={onPick} night={night} />
      <Chair />
      <Shelf onPick={onPick} />
      <Plant />
      <Lamp night={night} />
      <Frames onPick={onPick} />
      <Float speed={2} rotationIntensity={1} floatIntensity={1.2}>
        <mesh position={[1.6, 2.1, -1]} castShadow>
          <octahedronGeometry args={[0.22]} />
          <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={night ? 0.9 : 0.25} />
        </mesh>
      </Float>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={8} blur={2.4} far={3} />
    </>
  );
}

export default function Room({ night, onPick }: { night: boolean; onPick: (p: Pick) => void }) {
  // On tall, narrow screens widen the field of view so the whole room stays in frame.
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    setPortrait(mq.matches);
    const on = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return (
    <Canvas key={portrait ? "p" : "l"} shadows dpr={[1, 2]} camera={{ position: portrait ? [4.6, 3.0, 5.4] : [5.6, 3.9, 6.2], fov: portrait ? 62 : 44 }}>
      <Scene night={night} onPick={onPick} />
      <OrbitControls target={portrait ? [0, 0.35, -0.9] : [0, 1.1, -0.8]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.15} minAzimuthAngle={0.1} maxAzimuthAngle={Math.PI / 2.2} />
    </Canvas>
  );
}
