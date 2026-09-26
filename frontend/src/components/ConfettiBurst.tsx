"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger: boolean;
}

export default function ConfettiBurst({ trigger }: ConfettiProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (trigger && !hasFired.current) {
      hasFired.current = true;
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fbbf24", "#34d399", "#818cf8", "#f472b6", "#60a5fa"],
        disableForReducedMotion: true,
      });

      // Reset after short delay so it can fire again
      setTimeout(() => {
        hasFired.current = false;
      }, 500);
    }
  }, [trigger]);

  return null;
}
