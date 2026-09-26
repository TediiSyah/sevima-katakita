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

  useEffect(() => {
    onMascotMoodChange?.("idle", "Dengarkan suaranya dulu, lalu pilih ejaan yang benar ya!");
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
      if (feedbackStatus !== "idle") return;
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
        const speeches = ["Luar biasa! Ejaanmu tepat! 🎉", "Hebat! Kamu pintar! ⭐", "Keren! Jawabanmu benar! ✨"];
        onMascotMoodChange?.("happy", speeches[Math.floor(Math.random() * speeches.length)]);
        setTimeout(() => setShowConfetti(false), 1200);
      } else {
        sfx.playTryAgain();
        onMascotMoodChange?.("encouraging", "Tidak apa-apa! Setiap percobaan membuatmu makin pintar! 💪");
      }

      setTimeout(() => onJawab(opsi, benar), 1600);
    },
    [feedbackStatus, soal.jawaban_benar, comboStreak, onJawab, onMascotMoodChange]
  );

  const getOpsiClass = (opsi: string) => {
    if (feedbackStatus === "idle") return "btn-opsi-default";
    if (opsi === soal.jawaban_benar) return "btn-opsi-benar";
    if (opsi === pilihanDipilih && opsi !== soal.jawaban_benar) return "btn-opsi-salah";
    return "btn-opsi-disabled";
  };

  return (
    <div className="card card-soal-enter relative overflow-hidden">
      <ConfettiBurst trigger={showConfetti} />

      {/* Dekorasi pojok biru */}
      <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none" style={{ background: "linear-gradient(to bottom-left, #DBEAFE, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-tr-full pointer-events-none" style={{ background: "linear-gradient(to top-right, #EEF4FF, transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="badge-info-light text-sm font-bold">
          📝 Kata {nomorSoal} dari {totalSoal}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSoal }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < nomorSoal - 1
                  ? "bg-green-500"
                  : i === nomorSoal - 1
                  ? "bg-blue-600 scale-125 shadow-sm"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Instruksi + Tombol Dengarkan */}
      <div className="text-center my-6">
        <p className="text-gray-600 text-base sm:text-lg mb-5 font-semibold">
          Dengarkan kata berikut, lalu tentukan ejaannya:
        </p>

        <button
          id={`btn-dengarkan-${soal.id}`}
          onClick={handleDengarkan}
          className={`inline-flex items-center gap-3 px-10 py-5 rounded-3xl text-xl sm:text-2xl font-extrabold transition-all duration-200 active:scale-95 shadow-lg ${
            isSpeaking
              ? "text-white"
              : "text-white"
          }`}
          style={{
            background: isSpeaking
              ? "linear-gradient(135deg, #7C3AED, #6D28D9)"
              : "linear-gradient(135deg, #1B6FEF, #0D4FBB)",
            boxShadow: isSpeaking
              ? "0 8px 28px rgba(124, 58, 237, 0.45)"
              : "0 8px 28px rgba(27, 111, 239, 0.40)",
          }}
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

      {/* Opsi Jawaban */}
      <div className="grid gap-3 my-5">
        {soal.opsi_jawaban.map((opsi, idx) => (
          <button
            key={`${opsi}-${idx}`}
            id={`btn-opsi-${soal.id}-${idx}`}
            onClick={() => handlePilih(opsi)}
            disabled={feedbackStatus !== "idle"}
            className={getOpsiClass(opsi)}
          >
            <span className="font-mono tracking-wider text-2xl">{opsi}</span>
            {feedbackStatus !== "idle" && opsi === soal.jawaban_benar && (
              <span className="ml-3 text-xl">✅</span>
            )}
            {feedbackStatus !== "idle" && opsi === pilihanDipilih && opsi !== soal.jawaban_benar && (
              <span className="ml-3 text-xl">🔄</span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback Banner */}
      {feedbackStatus !== "idle" && (
        <div
          className={`rounded-2xl p-4 text-center text-lg font-extrabold transition-all animate-scale-in ${
            feedbackStatus === "benar"
              ? "bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border-2 border-green-300"
              : "bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border-2 border-amber-300"
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
              <span>Bagus sudah mencoba! Terus semangat ya!</span>
              <span className="text-2xl">😊</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
