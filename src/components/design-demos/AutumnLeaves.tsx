"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./tarot-demo.module.css";

type Leaf = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rotation: number;
  spin: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
  color: string;
};

const LEAF_COLORS = ["#b93b2e", "#cf522d", "#dd762c", "#dda52c", "#efbf43"];

function createLeaf(width: number, height: number, startInside = false): Leaf {
  const depth = 0.55 + Math.random() * 0.75;
  return {
    x: Math.random() * width,
    y: startInside ? Math.random() * height : -36 - Math.random() * height * 0.25,
    size: (8 + Math.random() * 7) * depth,
    speed: (27 + Math.random() * 37.5) * depth,
    drift: 14 + Math.random() * 32,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    spin: (-0.42 + Math.random() * 0.84) * depth,
    tilt: Math.random() * Math.PI * 2,
    tiltSpeed: 0.8 + Math.random() * 1.1,
    opacity: 0.48 + depth * 0.28,
    color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
  };
}

function drawLeaf(context: CanvasRenderingContext2D, leaf: Leaf, opacity = 1) {
  context.save();
  context.translate(leaf.x, leaf.y);
  context.rotate(leaf.rotation);
  context.scale(
    (leaf.size / 24) * (0.58 + Math.abs(Math.cos(leaf.tilt)) * 0.42),
    leaf.size / 24,
  );
  context.globalAlpha = leaf.opacity * opacity;
  context.fillStyle = leaf.color;
  context.strokeStyle = "rgb(91 47 31 / 42%)";
  context.lineWidth = 0.8;

  context.beginPath();
  context.moveTo(0, -24);
  context.bezierCurveTo(-2, -19, -5, -15, -9, -12);
  context.bezierCurveTo(-7, -11, -5, -10, -5, -7);
  context.bezierCurveTo(-10, -9, -15, -11, -20, -11);
  context.bezierCurveTo(-17, -7, -14, -3, -16, 1);
  context.bezierCurveTo(-12, 0, -9, 0, -10, 4);
  context.bezierCurveTo(-7, 4, -4, 6, -2, 9);
  context.lineTo(0, 23);
  context.lineTo(2, 9);
  context.bezierCurveTo(4, 6, 7, 4, 10, 4);
  context.bezierCurveTo(9, 0, 12, 0, 16, 1);
  context.bezierCurveTo(14, -3, 17, -7, 20, -11);
  context.bezierCurveTo(15, -11, 10, -9, 5, -7);
  context.bezierCurveTo(5, -10, 7, -11, 9, -12);
  context.bezierCurveTo(5, -15, 2, -19, 0, -24);
  context.closePath();
  context.fill();
  context.stroke();

  context.beginPath();
  context.moveTo(0, -20);
  context.lineTo(0, 23);
  context.strokeStyle = "rgb(255 231 174 / 32%)";
  context.lineWidth = 0.65;
  context.stroke();
  context.restore();
}

export default function AutumnLeaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef(0);
  const resumeRef = useRef<() => void>(() => undefined);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let leaves: Leaf[] = [];
    let previousFrame = performance.now();

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const leafCount = width < 720 ? 12 : 20;
      leaves = Array.from({ length: leafCount }, () => createLeaf(width, height, true));
    };

    const drawStaticLeaves = () => {
      context.clearRect(0, 0, width, height);
      leaves.slice(0, width < 720 ? 2 : 3).forEach((leaf, index) => {
        leaf.x = width * (0.66 + index * 0.12);
        leaf.y = height * (0.22 + index * 0.24);
        leaf.opacity = 0.42;
        drawLeaf(context, leaf);
      });
    };

    const animate = (now: number) => {
      if (pausedRef.current || reducedMotion.matches) return;
      const deltaSeconds = Math.min((now - previousFrame) / 1000, 0.034);
      previousFrame = now;

      context.clearRect(0, 0, width, height);
      leaves.forEach((leaf) => {
        const breeze = Math.sin(now * 0.00055 + leaf.phase) * leaf.drift;
        leaf.x += (breeze * 0.085 + Math.sin(now * 0.0011 + leaf.phase) * 5) * deltaSeconds;
        leaf.y += leaf.speed * deltaSeconds;
        leaf.rotation += leaf.spin * deltaSeconds;
        leaf.tilt += leaf.tiltSpeed * deltaSeconds;

        if (leaf.y > height + leaf.size * 2 || leaf.x < -80 || leaf.x > width + 80) {
          Object.assign(leaf, createLeaf(width, height));
        }
        drawLeaf(context, leaf);
      });
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      setCanvasSize();
      if (reducedMotion.matches) {
        drawStaticLeaves();
        return;
      }
      previousFrame = performance.now();
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    resumeRef.current = () => {
      if (reducedMotion.matches || pausedRef.current) return;
      window.cancelAnimationFrame(animationFrameRef.current);
      previousFrame = performance.now();
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrameRef.current);
      } else {
        resumeRef.current();
      }
    };

    const handleMotionPreference = () => {
      setMotionReduced(reducedMotion.matches);
      start();
    };

    handleMotionPreference();
    window.addEventListener("resize", start, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", start);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  const togglePaused = () => {
    const nextPaused = !pausedRef.current;
    pausedRef.current = nextPaused;
    setIsPaused(nextPaused);
    if (nextPaused) {
      window.cancelAnimationFrame(animationFrameRef.current);
    } else {
      resumeRef.current();
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className={styles.autumnLeaves} aria-hidden="true" />
      <button
        className={styles.autumnMotionControl}
        type="button"
        aria-pressed={isPaused}
        disabled={motionReduced}
        onClick={togglePaused}
      >
        {motionReduced ? "落叶已静止" : isPaused ? "继续落叶" : "暂停落叶"}
      </button>
    </>
  );
}
