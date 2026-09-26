"use client";

import React from "react";

export type MascotMood = "idle" | "listening" | "thinking" | "happy" | "encouraging" | "celebrate";

interface MascotCharacterProps {
  mood?: MascotMood;
  speechText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function MascotCharacter({
  mood = "idle",
  speechText,
  size = "md",
  className = "",
}: MascotCharacterProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-28 h-28 sm:w-32 sm:h-32",
    lg: "w-36 h-36 sm:w-44 sm:h-44",
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble ramah anak */}
      {speechText && (
        <div className="mb-2 relative bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-card border border-amber-200 text-sm font-bold text-amber-900 animate-bounce-subtle max-w-xs text-center z-10">
          <span>{speechText}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}

      {/* SVG Mascot: Kiko si Burung Hantu Cilik */}
      <div
        className={`${sizeClasses[size]} transition-all duration-300 relative ${
          mood === "happy"
            ? "animate-bounce"
            : mood === "celebrate"
            ? "animate-wiggle"
            : mood === "listening"
            ? "scale-105"
            : "floating"
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Bayangan bawah */}
          <ellipse cx="60" cy="112" rx="36" ry="7" fill="#000000" fillOpacity="0.12" />

          {/* Badan Bulat Hangat */}
          <circle cx="60" cy="62" r="46" fill="#FBBF24" />
          {/* Perut Pastel */}
          <ellipse cx="60" cy="74" rx="32" ry="28" fill="#FEF3C7" />

          {/* Telinga / Jambul Lucu */}
          <path
            d="M 28 32 C 22 14 38 18 42 26"
            stroke="#D97706"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 92 32 C 98 14 82 18 78 26"
            stroke="#D97706"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Sayap Kiri */}
          <path
            d={
              mood === "happy" || mood === "celebrate"
                ? "M 20 62 C 6 42 16 34 26 48"
                : "M 20 62 C 10 74 18 88 26 80"
            }
            fill="#D97706"
            className="transition-all duration-300"
          />

          {/* Sayap Kanan */}
          <path
            d={
              mood === "happy" || mood === "celebrate"
                ? "M 100 62 C 114 42 104 34 94 48"
                : "M 100 62 C 110 74 102 88 94 80"
            }
            fill="#D97706"
            className="transition-all duration-300"
          />

          {/* Lingkaran Mata Besar */}
          <circle cx="43" cy="52" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="77" cy="52" r="17" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2.5" />

          {/* Pupil Mata — Berubah Sesuai Mood */}
          {mood === "happy" || mood === "celebrate" ? (
            <>
              {/* Mata senyum melengkung gembira (^^) */}
              <path
                d="M 35 54 Q 43 44 51 54"
                stroke="#1F2937"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 69 54 Q 77 44 85 54"
                stroke="#1F2937"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : mood === "listening" ? (
            <>
              {/* Mata fokus membesar mendengarkan */}
              <circle cx="45" cy="52" r="9" fill="#1F2937" />
              <circle cx="79" cy="52" r="9" fill="#1F2937" />
              <circle cx="48" cy="49" r="3.5" fill="#FFFFFF" />
              <circle cx="82" cy="49" r="3.5" fill="#FFFFFF" />
              {/* Headphone mendengarkan audio */}
              <path
                d="M 22 52 C 22 24 98 24 98 52"
                stroke="#3B82F6"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <rect x="16" y="44" width="9" height="18" rx="4" fill="#2563EB" />
              <rect x="95" y="44" width="9" height="18" rx="4" fill="#2563EB" />
            </>
          ) : mood === "encouraging" ? (
            <>
              {/* Mata hangat berbinar */}
              <circle cx="44" cy="53" r="7.5" fill="#1F2937" />
              <circle cx="76" cy="53" r="7.5" fill="#1F2937" />
              <circle cx="46" cy="51" r="3" fill="#FFFFFF" />
              <circle cx="78" cy="51" r="3" fill="#FFFFFF" />
            </>
          ) : (
            <>
              {/* Mata normal berbinar ramah */}
              <circle cx="44" cy="52" r="7" fill="#1F2937" />
              <circle cx="76" cy="52" r="7" fill="#1F2937" />
              <circle cx="46" cy="50" r="2.5" fill="#FFFFFF" />
              <circle cx="78" cy="50" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Rona Merah Pipi Imut */}
          <circle cx="31" cy="65" r="5" fill="#F43F5E" fillOpacity="0.35" />
          <circle cx="89" cy="65" r="5" fill="#F43F5E" fillOpacity="0.35" />

          {/* Paruh Oranye Menggemaskan */}
          <polygon points="54,58 66,58 60,70" fill="#EA580C" />

          {/* Kaki Ceria */}
          <path d="M 47 106 L 47 111 M 43 111 L 51 111" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />
          <path d="M 73 106 L 73 111 M 69 111 L 77 111" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" />

          {/* Topi Wisuda Mini saat Celebrate */}
          {mood === "celebrate" && (
            <g transform="translate(60, 18)">
              <polygon points="0,-12 24,0 0,12 -24,0" fill="#1E3A8A" />
              <polygon points="-8,4 8,4 6,12 -6,12" fill="#172554" />
              <circle cx="0" cy="0" r="2" fill="#FBBF24" />
              <path d="M 0 0 Q 14 6 18 16" stroke="#F59E0B" strokeWidth="2" fill="none" />
              <circle cx="18" cy="16" r="2" fill="#D97706" />
            </g>
          )}
        </svg>

        {/* Partikel bintang kecil saat happy / celebrate */}
        {(mood === "happy" || mood === "celebrate") && (
          <>
            <span className="absolute -top-3 -left-2 text-xl animate-spin text-yellow-400">✨</span>
            <span className="absolute -top-4 -right-1 text-2xl animate-ping text-amber-400">⭐</span>
            <span className="absolute bottom-6 -right-3 text-lg text-pink-400">💖</span>
          </>
        )}
      </div>
    </div>
  );
}
