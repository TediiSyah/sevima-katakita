"use client";

import { useState, useCallback, useEffect } from "react";
import { SoalLatihan, FeedbackStatus } from "@/types";
import ConfettiBurst from "./ConfettiBurst";
import { sfx } from "@/lib/soundEffects";
import { MascotMood } from "./MascotCharacter";

interface KartuSoalProps {
  soal: SoalLatihan;
  nomorSoal: number;
  totalSoal: number;
  comboStreak: number;
  onJawab: (jawaban: string, benar: boolean) => void;
  onMascotMoodChange?: (mood: MascotMood, speech?: string) => void;
}

export default function KartuSoal({
  soal,
  nomorSoal,
  totalSoal,
  comboStreak,
  onJawab,
  onMascotMoodChange,
}: KartuSoalProps) {
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [pilihanDipilih, setPilihanDipilih] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Set mood maskot awal
  useEffect(() => {
    onMascotMoodChange?.("idle", "Dengarkan suaranya, lalu pilih ejaan yang benar ya!");
  }, [soal.id, onMascotMoodChange]);

  const handleDengarkan = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(soal.audio_text);
    utterance.lang = "id-ID";
    utterance.rate = 0.82;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onMascotMoodChange?.("listening", `Sedang mendengarkan kata "${soal.audio_text}"...`);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      onMascotMoodChange?.("idle", "Manakah ejaan yang tepat?");
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onMascotMoodChange?.("idle", "Manakah ejaan yang tepat?");
    };

    window.speechSynthesis.speak(utterance);
  }, [soal.audio_text, onMascotMoodChange]);

  const handlePilih = useCallback(
    (opsi: string) => {
      if (feedbackStatus !== "idle") return; // sudah dijawab

      const benar = opsi === soal.jawaban_benar;
      setPilihanDipilih(opsi);
      setFeedbackStatus(benar ? "benar" : "coba_lagi");

      if (benar) {
        setShowConfetti(true);
        if (comboStreak >= 1) {
          sfx.playCombo(comboStreak + 1);
        } else {
          sfx.playSuccess();
        }

        const speechList = [
          "Luar biasa! Ejaanmu tepat sekali! 🎉",
          "Hebat! Kamu pintar banget! ⭐",
          "Keren! Jawabanmu benar! ✨",
        ];
        const randomSpeech = speechList[Math.floor(Math.random() * speechList.length)];
        onMascotMoodChange?.("happy", randomSpeech);

        setTimeout(() => setShowConfetti(false), 1200);
      } else {
        sfx.playTryAgain();
        onMascotMoodChange?.(
          "encouraging",
          "Tidak apa-apa! Setiap coba lagi membuatmu makin pintar! 💪"
        );
      }

      // Lanjut ke soal berikutnya setelah feedback
      setTimeout(() => {
        onJawab(opsi, benar);
      }, 1600);
    },
    [feedbackStatus, soal.jawaban_benar, comboStreak, onJawab, onMascotMoodChange]
  );

  const getOpsiClass = (opsi: string): string => {
    if (feedbackStatus === "idle") {
      return "w-full py-4 px-6 rounded-2xl font-bold text-xl sm:text-2xl transition-all duration-200 bg-white border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 hover:shadow-card-hover active:scale-98 shadow-sm flex items-center justify-center gap-3 text-gray-800";
    }
    if (opsi === soal.jawaban_benar) {
      return "w-full py-4 px-6 rounded-2xl font-bold text-xl sm:text-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-600 shadow-md scale-[1.02] flex items-center justify-center gap-3 transition-all";
    }
    if (opsi === pilihanDipilih && opsi !== soal.jawaban_benar) {
      return "w-full py-4 px-6 rounded-2xl font-bold text-xl sm:text-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 opacity-90 flex items-center justify-center gap-3 transition-all";
    }
    return "w-full py-4 px-6 rounded-2xl font-bold text-xl sm:text-2xl bg-gray-100 text-gray-400 border-2 border-transparent opacity-60 flex items-center justify-center gap-3";
  };

  return (
    <div className="card card-soal-enter relative overflow-hidden">
      <ConfettiBurst trigger={showConfetti} />

      {/* Dekorasi Pojok */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-yellow-100 to-transparent rounded-bl-full opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-60 pointer-events-none" />

      {/* Header Kartu */}
      <div className="flex items-center justify-between mb-4">
        <span className="badge badge-info text-sm sm:text-base px-4 py-1.5 font-bold">
          📝 Kata {nomorSoal} dari {totalSoal}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSoal }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < nomorSoal - 1
                  ? "bg-green-500 scale-100"
                  : i === nomorSoal - 1
                  ? "bg-amber-400 scale-125 shadow-sm"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instruksi Suara & Tombol Dengarkan */}
      <div className="text-center my-6">
        <p className="text-gray-600 text-base sm:text-lg mb-4 font-semibold">
          Dengarkan kata ini, lalu tentukan ejaan yang benar:
        </p>

        {/* Tombol Speaker Besar Playful */}
        <button
          id={`btn-dengarkan-${soal.id}`}
          onClick={handleDengarkan}
          className={`
            inline-flex items-center gap-3 px-8 py-4 rounded-3xl text-xl sm:text-2xl font-extrabold
            transition-all duration-200 active:scale-95 shadow-btn hover:shadow-btn-hover
            ${
              isSpeaking
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white animate-pulse"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-400 hover:to-cyan-400"
            }
          `}
          title="Klik untuk mendengarkan kata"
        >
          <span className={`text-3xl ${isSpeaking ? "animate-wiggle" : ""}`}>
            {isSpeaking ? "👂" : "🔊"}
          </span>
          <span>{isSpeaking ? "Mendengarkan..." : "Dengarkan Kata"}</span>
        </button>

        <p className="text-xs text-gray-400 mt-2 font-medium">
          💡 Klik tombol di atas untuk mendengar pengucapan kata
        </p>
      </div>

      {/* Pilihan Opsi Jawaban */}
      <div className="grid gap-3.5 my-6">
        {soal.opsi_jawaban.map((opsi, idx) => (
          <button
            key={`${opsi}-${idx}`}
            id={`btn-opsi-${soal.id}-${idx}`}
            onClick={() => handlePilih(opsi)}
            disabled={feedbackStatus !== "idle"}
            className={getOpsiClass(opsi)}
          >
            <span className="font-mono tracking-wider">{opsi}</span>
            {feedbackStatus !== "idle" && opsi === soal.jawaban_benar && (
              <span className="text-2xl">✅</span>
            )}
            {feedbackStatus !== "idle" &&
              opsi === pilihanDipilih &&
              opsi !== soal.jawaban_benar && <span className="text-2xl">🔄</span>}
          </button>
        ))}
      </div>

      {/* Banner Feedback Ceria */}
      {feedbackStatus !== "idle" && (
        <div
          className={`rounded-2xl p-4 text-center text-lg font-extrabold animate-scale-in transition-all ${
            feedbackStatus === "benar"
              ? "bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border-2 border-green-300 shadow-sm"
              : "bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border-2 border-amber-300 shadow-sm"
          }`}
        >
          {feedbackStatus === "benar" ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎉</span>
              <span>Luar biasa! Ejaanmu tepat!</span>
              <span className="text-2xl">⭐</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">💡</span>
              <span>Bagus sekali sudah mencoba! Terus semangat ya!</span>
              <span className="text-2xl">😊</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
