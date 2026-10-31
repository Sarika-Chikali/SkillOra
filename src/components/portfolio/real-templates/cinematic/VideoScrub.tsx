"use client";

// Ported from the cinematic-portfolio source (Sarang, MIT): two videos (forward
// + reversed) are scrubbed by scroll velocity so the background "plays" as you
// scroll in either direction. Scroll is measured relative to the template's
// own wrapper rather than the window, so it works when embedded in the editor.

import { useEffect, useRef } from "react";
import styles from "./Template.module.css";

const BASE = "/templates/cinematic";

export default function VideoScrub({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const fwdRef = useRef<HTMLVideoElement>(null);
  const revRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fwd = fwdRef.current;
    const rev = revRef.current;
    const wrapper = wrapperRef.current;
    if (!fwd || !rev || !wrapper) return;

    let duration = 0;
    let raf = 0;
    let prevY = 0;
    let prevT = performance.now();
    let vel = 0;
    let frozenSnap: number | null = null;
    let activeEl: HTMLVideoElement = fwd;
    let videoEndScroll = 1;
    let disposed = false;

    const FREEZE_VEL = 5;
    const PLAY_VEL = 90;
    const EDGE = 0.12;

    const relScroll = () => Math.max(0, -wrapper.getBoundingClientRect().top);
    const calcEnd = () => {
      const contact = wrapper.querySelector<HTMLElement>("#contact");
      const wrapTop = wrapper.getBoundingClientRect().top + window.scrollY;
      if (contact) {
        const top = contact.getBoundingClientRect().top + window.scrollY - wrapTop;
        videoEndScroll = Math.max(1, top + contact.offsetHeight * 0.5 - window.innerHeight * 0.5);
      } else {
        videoEndScroll = Math.max(1, wrapper.scrollHeight - window.innerHeight);
      }
    };
    calcEnd();
    prevY = relScroll();
    window.addEventListener("resize", calcEnd, { passive: true });
    const recalc = setInterval(calcEnd, 2000);

    const show = (el: HTMLVideoElement) => {
      if (activeEl === el) return;
      activeEl = el;
      fwd.style.opacity = el === fwd ? "1" : "0";
      rev.style.opacity = el === rev ? "1" : "0";
    };

    const seeker = (v: HTMLVideoElement) => {
      let seeking = false;
      let pend: { t: number; fast: boolean } | null = null;
      const flush = () => {
        if (!pend) {
          seeking = false;
          return;
        }
        const { t, fast } = pend;
        pend = null;
        if (Math.abs(v.currentTime - t) < 0.033) {
          seeking = false;
          return;
        }
        seeking = true;
        if (fast && v.fastSeek) v.fastSeek(t);
        else v.currentTime = t;
      };
      v.addEventListener("seeked", flush);
      return {
        seek(t: number, fast = false) {
          pend = { t: Math.max(0, Math.min(duration, t)), fast };
          if (!seeking) flush();
        },
        off: () => v.removeEventListener("seeked", flush),
      };
    };
    const sf = seeker(fwd);
    const sr = seeker(rev);

    let fwdSyncAt = 0;
    let revSyncAt = 0;
    const bgSync = (v: HTMLVideoElement, t: number, now: number, which: "f" | "r") => {
      const last = which === "f" ? fwdSyncAt : revSyncAt;
      if (now - last < 300 || Math.abs(v.currentTime - t) < 0.3) return;
      if (v.fastSeek) v.fastSeek(t);
      else v.currentTime = t;
      if (which === "f") fwdSyncAt = now;
      else revSyncAt = now;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!duration) return;
      const dt = Math.max((now - prevT) / 1000, 0.001);
      prevT = now;
      const scrollY = relScroll();
      vel = vel * 0.82 + ((scrollY - prevY) / dt) * 0.18;
      prevY = scrollY;

      const progress = Math.min(1, scrollY / videoEndScroll);
      const tgt = progress * duration;
      const revTgt = duration - tgt;
      const absVel = Math.abs(vel);
      const atStart = tgt <= EDGE;

      if (progress >= 1) {
        if (!fwd.paused) fwd.pause();
        if (!rev.paused) rev.pause();
        show(fwd);
        frozenSnap = null;
        return;
      }
      if (absVel < FREEZE_VEL || atStart) {
        if (!fwd.paused) fwd.pause();
        if (!rev.paused) rev.pause();
        show(fwd);
        if (frozenSnap === null) {
          frozenSnap = atStart ? 0 : tgt;
          sf.seek(frozenSnap);
        }
        return;
      }
      frozenSnap = null;

      if (absVel < PLAY_VEL) {
        if (!fwd.paused) fwd.pause();
        if (!rev.paused) rev.pause();
        if (vel > 0) {
          if (tgt > fwd.currentTime + 0.033) sf.seek(tgt);
          show(fwd);
          bgSync(rev, revTgt, now, "r");
        } else {
          if (revTgt > rev.currentTime + 0.033) sr.seek(revTgt, true);
          show(rev);
          bgSync(fwd, tgt, now, "f");
        }
        return;
      }

      const invM = duration / videoEndScroll;
      if (vel > 0) {
        const rate = Math.min(8, Math.max(0.25, vel * invM));
        if (Math.abs(fwd.playbackRate - rate) > 0.05) fwd.playbackRate = rate;
        if (Math.abs(fwd.currentTime - tgt) > 1.5) fwd.currentTime = tgt;
        if (fwd.paused) fwd.play().catch(() => {});
        if (!rev.paused) rev.pause();
        show(fwd);
        bgSync(rev, revTgt, now, "r");
      } else {
        const rate = Math.min(8, Math.max(0.25, absVel * invM));
        if (Math.abs(rev.playbackRate - rate) > 0.05) rev.playbackRate = rate;
        if (Math.abs(rev.currentTime - revTgt) > 1.5) rev.currentTime = revTgt;
        if (rev.paused) rev.play().catch(() => {});
        if (!fwd.paused) fwd.pause();
        show(rev);
        bgSync(fwd, tgt, now, "f");
      }
    };

    const onFwdEnded = () => {
      fwd.pause();
      fwd.currentTime = duration;
    };
    const onRevEnded = () => {
      rev.pause();
      rev.currentTime = duration;
    };
    fwd.addEventListener("ended", onFwdEnded);
    rev.addEventListener("ended", onRevEnded);

    let preload: ReturnType<typeof setTimeout> | undefined;
    const setup = () => {
      if (disposed) return;
      duration = fwd.duration;
      fwd.currentTime = 0;
      rev.currentTime = duration;
      raf = requestAnimationFrame(frame);
      preload = setTimeout(() => {
        rev.play().then(() => {
          rev.pause();
          rev.currentTime = duration;
        }).catch(() => {});
      }, 3000);
    };
    if (fwd.readyState >= 1) setup();
    else fwd.addEventListener("loadedmetadata", setup, { once: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearInterval(recalc);
      clearTimeout(preload);
      window.removeEventListener("resize", calcEnd);
      sf.off();
      sr.off();
      fwd.removeEventListener("ended", onFwdEnded);
      rev.removeEventListener("ended", onRevEnded);
      fwd.removeEventListener("loadedmetadata", setup);
    };
  }, [wrapperRef]);

  return (
    <div className={styles.videoLayer}>
      <video ref={fwdRef} src={`${BASE}/optimized.mp4`} poster={`${BASE}/hero.webp`} className={styles.video} style={{ opacity: 1 }} muted playsInline preload="metadata" aria-hidden="true" />
      <video ref={revRef} src={`${BASE}/optimized-rev.mp4`} className={styles.video} style={{ opacity: 0 }} muted playsInline preload="none" aria-hidden="true" />
      <div className={styles.shade1} />
      <div className={styles.shade2} />
      <div className={styles.shade3} />
    </div>
  );
}
