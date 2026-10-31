"use client";

import { useEffect, useRef } from "react";

export type MousePosition = { x: number; y: number };

export function useMouseParallax() {
  const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
  const smoothRef = useRef<MousePosition>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function animate() {
      smoothRef.current.x = lerp(smoothRef.current.x, mouseRef.current.x, 0.05);
      smoothRef.current.y = lerp(smoothRef.current.y, mouseRef.current.y, 0.05);
      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return smoothRef;
}
