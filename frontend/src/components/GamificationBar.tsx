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
    if (!muted) {
      sfx.playPop();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-card border border-amber-100 flex items-center justify-between gap-3 relative select-none">
      {/* Indikator Bintang + Skor Melayang */}
      <div className="flex items-center gap-2 relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-xl shadow-sm">
          ⭐
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Bintang Belajar
          </div>
          <div className="text-xl font-extrabold text-amber-900 leading-none">
            {bintang}
          </div>
        </div>

        {/* Efek Floating Score (+10 ⭐) */}
        {floatingScore !== null && floatingScore > 0 && (
          <div className="absolute -top-7 left-12 animate-slide-up text-amber-500 font-extrabold text-base bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-sm pointer-events-none">
            +{floatingScore} ⭐
          </div>
        )}
      </div>

      {/* Combo Streak Tracker */}
      <div className="flex-1 flex justify-center">
        {comboStreak >= 2 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-md animate-pulse">
            <span className="text-sm">🔥</span>
            <span>{comboStreak}x KOMBO!</span>
            {comboStreak >= 3 && <span className="text-xs">⚡</span>}
          </div>
        ) : (
          <div className="text-xs text-gray-400 font-medium">
            Soal {soalAktif} dari {totalSoal}
          </div>
        )}
      </div>

      {/* Tombol Suara (Mute / Unmute) */}
      <button
        onClick={handleToggleMute}
        title={isMuted ? "Bunyikan Efek Suara" : "Matikan Efek Suara"}
        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center text-lg text-gray-700"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
    </div>
  );
}
