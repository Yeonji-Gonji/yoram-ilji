"use client";

import { useEffect, useRef, useState } from "react";
import { useCursorTrail } from "./CursorTrailContext";

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const { enabled } = useCursorTrail();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const animationRef = useRef<number>(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);

      // 거리가 충분할 때만 포인트 추가 (성능 최적화)
      if (distance > 8) {
        pointsRef.current.push({ x, y, age: 0 });
        lastX = x;
        lastY = y;

        // 포인트 수 제한
        if (pointsRef.current.length > 40) {
          pointsRef.current.shift();
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;

      // Age and filter points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age += 2;
        if (points[i].age > 50) {
          points.splice(i, 1);
        }
      }

      if (points.length < 2) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 단일 경로로 그리기 (성능 최적화)
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];

        const progress = i / points.length;
        const alpha = (1 - p2.age / 50) * 0.8;
        const width = 10 * progress;

        // 그라데이션 색상: 흰색 → 시안 → 보라
        const r = Math.round(255 - progress * 175);
        const g = Math.round(255 - progress * 55);
        const b = 255;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // 커서 위치에 밝은 점
      if (points.length > 0) {
        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [enabled]);

  if (isTouchDevice || !enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
