"use client";

import React, { useState, useEffect } from "react";
import { sfx } from "@/lib/soundEffects";

interface GamificationBarProps {
  bintang: number;
  comboStreak: number;
  soalAktif: number;
  totalSoal: number;
  floatingScore?: number | null;
}

export default function GamificationBar({
  bintang,
  comboStreak,
  soalAktif,
  totalSoal,
  floatingScore = null,
}: GamificationBarProps) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sfx.getMuted());
  }, []);

  const handleToggleMute = () => {
    const muted = sfx.toggleMute();
    setIsMuted(muted);
    if (!muted) sfx.playPop();
  };

  return (
    <div
      className="rounded-2xl p-3 flex items-center justify-between gap-3 relative select-none"
      style={{
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      {/* Bintang */}
      <div className="flex items-center gap-2 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-xl shadow-md">
          ⭐
        </div>
        <div>
          <div className="text-xs font-bold text-white/70 uppercase tracking-wider">Bintang</div>
          <div className="text-xl font-extrabold text-white leading-none">{bintang}</div>
        </div>
        {floatingScore !== null && floatingScore > 0 && (
          <div className="absolute -top-7 left-10 animate-slide-up text-amber-300 font-extrabold text-sm bg-white/20 px-2 py-0.5 rounded-full border border-white/30 pointer-events-none">
            +{floatingScore} ⭐
          </div>
        )}
      </div>

      {/* Kombo / Progres */}
      <div className="flex-1 flex justify-center">
        {comboStreak >= 2 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-md animate-pulse">
            <span className="text-sm">🔥</span>
            <span>{comboStreak}x KOMBO!</span>
            {comboStreak >= 3 && <span>⚡</span>}
          </div>
        ) : (
          <div className="text-xs text-white/70 font-semibold">
            Soal {soalAktif} / {totalSoal}
          </div>
        )}
      </div>

      {/* Mute toggle */}
      <button
        onClick={handleToggleMute}
        title={isMuted ? "Nyalakan Suara" : "Matikan Suara"}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white transition-all active:scale-95"
        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
