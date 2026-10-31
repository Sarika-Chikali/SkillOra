"use client";

// Ported from the "3d-portfolio" source (Rajesh Chityal, MIT): loads the
// AES-encrypted rigged character, plays its intro/typing/blink clips, and
// makes the head follow the cursor. Scoped to a container instead of the
// original's fixed full-window canvas so it can live inside an embedded page.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { gsap } from "gsap";
import { eyebrowBoneNames, typingBoneNames } from "./boneData";
import styles from "./Template.module.css";

const BASE = "/templates/char3d";

async function decryptFile(url: string, password: string): Promise<ArrayBuffer> {
  const encrypted = await (await fetch(url)).arrayBuffer();
  const iv = new Uint8Array(encrypted.slice(0, 16));
  const data = encrypted.slice(16);
  const hashed = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  const key = await crypto.subtle.importKey("raw", hashed.slice(0, 32), { name: "AES-CBC" }, false, ["decrypt"]);
  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
}

function boneAction(gltf: GLTF, mixer: THREE.AnimationMixer, clipName: string, bones: string[]) {
  const clip = THREE.AnimationClip.findByName(gltf.animations, clipName);
  if (!clip) return null;
  const tracks = clip.tracks.filter((t) => bones.some((b) => t.name.includes(b)));
  return mixer.clipAction(new THREE.AnimationClip(clip.name + "_filtered", clip.duration, tracks));
}

export default function Character() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let raf = 0;
    let visible = true;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const size = () => ({ w: mount.clientWidth || 800, h: mount.clientHeight || 600 });
    let { w, h } = size();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, w / h, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    // Portrait screens are much narrower than the wide framing this camera was tuned
    // for, so pull back until the whole character (not just the head) fits.
    const fit = () => {
      camera.zoom = camera.aspect < 1 ? 0.6 : 1.1;
      camera.updateProjectionMatrix();
    };
    fit();

    const dirLight = new THREE.DirectionalLight(0x5eead4, 0);
    dirLight.position.set(-0.47, -0.32, -1);
    dirLight.castShadow = true;
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x22d3ee, 0, 100, 3);
    pointLight.position.set(3, 12, 4);
    scene.add(pointLight);

    new RGBELoader().load(`${BASE}/char_enviorment.hdr`, (tex) => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = tex;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Mesh | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();
    let mouse = { x: 0, y: 0 };
    const cleanups: Array<() => void> = [];

    (async () => {
      try {
        const buffer = await decryptFile(`${BASE}/character.enc`, "MyCharacter12");
        if (disposed) return;
        const url = URL.createObjectURL(new Blob([buffer]));
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath(`${BASE}/draco/`);
        loader.setDRACOLoader(draco);
        loader.load(url, async (gltf) => {
          URL.revokeObjectURL(url);
          if (disposed) return;
          const character = gltf.scene;
          character.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh) return;
            if (mesh.material && (mesh.name === "BODY.SHIRT" || mesh.name === "Pant")) {
              const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
              mat.color = new THREE.Color(mesh.name === "Pant" ? "#000000" : "#8B4513");
              mesh.material = mat;
            }
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          });
          // The source hides the desk/monitor meshes until its scroll timeline
          // fades them in; with no scroll choreography here they stay hidden.
          character.children.forEach((object) => {
            const obj = object as THREE.Mesh;
            if (object.name === "Plane004") {
              object.children.forEach((child) => {
                const m = (child as THREE.Mesh).material as THREE.Material | undefined;
                if (m) {
                  m.transparent = true;
                  m.opacity = 0;
                }
              });
            }
            if (object.name === "screenlight") {
              const m = obj.material as THREE.MeshStandardMaterial;
              m.transparent = true;
              m.opacity = 0;
              m.emissive.set("#B0F5EA");
            }
          });
          character.getObjectByName("footR")!.position.y = 3.36;
          character.getObjectByName("footL")!.position.y = 3.36;
          await renderer.compileAsync(character, camera, scene);
          if (disposed) return;
          scene.add(character);
          draco.dispose();

          headBone = character.getObjectByName("spine006") || null;
          screenLight = (character.getObjectByName("screenlight") as THREE.Mesh) || null;

          mixer = new THREE.AnimationMixer(character);
          const intro = gltf.animations.find((c) => c.name === "introAnimation");
          if (intro) {
            const a = mixer.clipAction(intro);
            a.setLoop(THREE.LoopOnce, 1);
            a.clampWhenFinished = true;
            a.play();
          }
          ["key1", "key2", "key5", "key6"].forEach((name) => {
            const clip = THREE.AnimationClip.findByName(gltf.animations, name);
            if (clip) {
              const action = mixer!.clipAction(clip);
              action.play();
              action.timeScale = 1.2;
            }
          });
          const typing = boneAction(gltf, mixer, "typing", typingBoneNames);
          if (typing) {
            typing.enabled = true;
            typing.play();
            typing.timeScale = 1.2;
          }

          const brow = boneAction(gltf, mixer, "browup", eyebrowBoneNames);
          if (brow) {
            brow.setLoop(THREE.LoopOnce, 1);
            brow.clampWhenFinished = true;
            brow.enabled = true;
          }
          let hovering = false;
          const hoverEl = hoverRef.current;
          const enter = () => {
            if (brow && !hovering) {
              hovering = true;
              brow.reset();
              brow.enabled = true;
              brow.setEffectiveWeight(4);
              brow.fadeIn(0.5).play();
            }
          };
          const leave = () => {
            if (brow && hovering) {
              hovering = false;
              brow.fadeOut(0.6);
            }
          };
          hoverEl?.addEventListener("mouseenter", enter);
          hoverEl?.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            hoverEl?.removeEventListener("mouseenter", enter);
            hoverEl?.removeEventListener("mouseleave", leave);
          });

          const t = setTimeout(() => {
            if (disposed) return;
            const intro2 = gltf.animations.find((c) => c.name === "introAnimation");
            if (intro2 && mixer) {
              const a = mixer.clipAction(intro2);
              a.clampWhenFinished = true;
              a.reset().play();
            }
            gsap.to(scene, { environmentIntensity: 0.64, duration: 2, ease: "power2.inOut" });
            gsap.to(dirLight, { intensity: 1, duration: 2, ease: "power2.inOut" });
            if (rimRef.current) gsap.to(rimRef.current, { y: "55%", opacity: 1, delay: 0.2, duration: 2 });
            setTimeout(() => {
              const blink = gltf.animations.find((c) => c.name === "Blink");
              if (blink && mixer && !disposed) mixer.clipAction(blink).play().fadeIn(0.5);
            }, 2500);
          }, 800);
          cleanups.push(() => clearTimeout(t));
        });
      } catch (err) {
        console.error("Character failed to load", err);
      }
    })();

    const onMouse = (e: MouseEvent) => {
      mouse = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 };
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      ({ w, h } = size());
      renderer.setSize(w, h);
      camera.aspect = w / h;
      fit();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0 });
    io.observe(mount);

    const lerp = THREE.MathUtils.lerp;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      if (headBone) {
        const maxRot = Math.PI / 6;
        headBone.rotation.y = lerp(headBone.rotation.y, mouse.x * maxRot, 0.2);
        const my = mouse.y;
        const target = my > -0.3 ? (my < 0.4 ? -my - 0.5 * maxRot : -maxRot - 0.5 * maxRot) : 0.3 - 0.5 * maxRot;
        headBone.rotation.x = lerp(headBone.rotation.x, target, 0.1);
        if (screenLight) {
          const mat = screenLight.material as THREE.MeshStandardMaterial;
          pointLight.intensity = mat.opacity > 0.9 ? mat.emissiveIntensity * 20 : 0;
        }
      }
      mixer?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(scene);
      gsap.killTweensOf(dirLight);
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className={styles.characterModel} ref={mountRef}>
      <div className={styles.characterRim} ref={rimRef} />
      <div className={styles.characterHover} ref={hoverRef} />
    </div>
  );
}
