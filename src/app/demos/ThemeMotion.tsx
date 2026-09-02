"use client";

import Link from "next/link";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import styles from "./demos.module.css";

type MotionThemeCardProps = {
  children: ReactNode;
  className: string;
  href: string;
};

type Ripple = {
  age: number;
  x: number;
  y: number;
};

const TILT_LIMIT = 4;
const RIPPLE_LIFETIME = 760;

export function MotionThemeCard({ children, className, href }: MotionThemeCardProps) {
  const frameRef = useRef<number | null>(null);
  const motionAllowedRef = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      motionAllowedRef.current = finePointer.matches && !reducedMotion.matches;
    };

    updateMotionPreference();
    finePointer.addEventListener("change", updateMotionPreference);
    reducedMotion.addEventListener("change", updateMotionPreference);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      finePointer.removeEventListener("change", updateMotionPreference);
      reducedMotion.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const resetCard = (element: HTMLAnchorElement) => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    element.style.setProperty("--tilt-x", "0deg");
    element.style.setProperty("--tilt-y", "0deg");
    element.style.setProperty("--card-lift", "0px");
    element.style.setProperty("--tilt-duration", "280ms");
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!motionAllowedRef.current) return;

    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateX = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, vertical * -8));
    const rotateY = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, horizontal * 8));

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      element.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      element.style.setProperty("--card-lift", "-4px");
      element.style.setProperty("--tilt-duration", "70ms");
      frameRef.current = null;
    });
  };

  return (
    <Link
      className={`${styles.demoCard} ${className}`}
      href={href}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetCard(event.currentTarget)}
    >
      {children}
    </Link>
  );
}

export function ThemeRippleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const ripples: Ripple[] = [];
    let animationFrame: number | null = null;
    let lastFrame = performance.now();
    let lastRippleAt = 0;
    let lastRippleX = -1000;
    let lastRippleY = -1000;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let targetX = pointerX;
    let targetY = pointerY;
    let glow = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (now: number) => {
      const elapsed = Math.min(now - lastFrame, 32);
      lastFrame = now;
      pointerX += (targetX - pointerX) * 0.14;
      pointerY += (targetY - pointerY) * 0.14;
      glow = Math.max(0, glow - elapsed / 1700);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (glow > 0.01) {
        const radius = Math.min(330, window.innerWidth * 0.28);
        const gradient = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, radius);
        const color = darkMode.matches ? "121, 174, 202" : "181, 71, 103";
        gradient.addColorStop(0, `rgba(${color}, ${0.07 * glow})`);
        gradient.addColorStop(0.42, `rgba(${color}, ${0.035 * glow})`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        ripple.age += elapsed;
        const progress = ripple.age / RIPPLE_LIFETIME;
        if (progress >= 1) {
          ripples.splice(index, 1);
          continue;
        }

        const radius = 18 + progress * 150;
        const alpha = Math.pow(1 - progress, 2) * 0.14;
        context.beginPath();
        context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2);
        context.strokeStyle = darkMode.matches
          ? `rgba(132, 190, 216, ${alpha})`
          : `rgba(152, 76, 105, ${alpha})`;
        context.lineWidth = 1.25;
        context.stroke();
      }

      if (
        ripples.length > 0 ||
        glow > 0.01 ||
        Math.abs(targetX - pointerX) > 0.2 ||
        Math.abs(targetY - pointerY) > 0.2
      ) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        animationFrame = null;
      }
    };

    const requestDraw = () => {
      if (animationFrame === null && !document.hidden) {
        lastFrame = performance.now();
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const addRipple = (x: number, y: number) => {
      ripples.push({ age: 0, x, y });
      if (ripples.length > 8) ripples.shift();
      requestDraw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || !finePointer.matches) return;
      targetX = event.clientX;
      targetY = event.clientY;
      glow = 1;

      const distance = Math.hypot(event.clientX - lastRippleX, event.clientY - lastRippleY);
      const now = performance.now();
      if (distance > 84 && now - lastRippleAt > 110) {
        addRipple(event.clientX, event.clientY);
        lastRippleX = event.clientX;
        lastRippleY = event.clientY;
        lastRippleAt = now;
      }
      requestDraw();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      targetX = event.clientX;
      targetY = event.clientY;
      pointerX = event.clientX;
      pointerY = event.clientY;
      glow = 1;
      addRipple(event.clientX, event.clientY);
    };

    const handleVisibilityChange = () => {
      if (document.hidden && animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    const handleReducedMotionChange = () => {
      if (!reducedMotion.matches) return;
      ripples.length = 0;
      glow = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleReducedMotionChange);

    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.rippleField} aria-hidden="true" />;
}
