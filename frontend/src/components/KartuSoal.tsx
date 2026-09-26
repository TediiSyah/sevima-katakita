"use client";

import { useState, useCallback } from "react";
import { SoalLatihan, FeedbackStatus } from "@/types";
import ConfettiBurst from "./ConfettiBurst";

interface KartuSoalProps {
  soal: SoalLatihan;
  nomorSoal: number;
  totalSoal: number;
  onJawab: (jawaban: string, benar: boolean) => void;
}

export default function KartuSoal({
  soal,
  nomorSoal,
  totalSoal,
  onJawab,
}: KartuSoalProps) {
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");
  const [pilihanDipilih, setPilihanDipilih] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleDengarkan = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(soal.audio_text);
    utterance.lang = "id-ID";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [soal.audio_text]);

  const handlePilih = useCallback(
    (opsi: string) => {
      if (feedbackStatus !== "idle") return; // sudah dijawab

      const benar = opsi === soal.jawaban_benar;
      setPilihanDipilih(opsi);
      setFeedbackStatus(benar ? "benar" : "coba_lagi");

      if (benar) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }

      // Lanjut ke soal berikutnya setelah delay
      setTimeout(() => {
        onJawab(opsi, benar);
      }, 1800);
    },
    [feedbackStatus, soal.jawaban_benar, onJawab]
  );

  const getOpsiClass = (opsi: string): string => {
    if (feedbackStatus === "idle") return "btn-opsi-default";
    if (opsi === soal.jawaban_benar) return "btn-opsi-benar";
    if (opsi === pilihanDipilih && !opsi.includes(soal.jawaban_benar))
      return "btn-opsi-salah";
    return "btn-opsi-disabled";
  };

  return (
    <div className="card card-soal-enter relative overflow-hidden">
      <ConfettiBurst trigger={showConfetti} />

      {/* Dekorasi pojok */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-100 to-transparent rounded-bl-full opacity-60" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-full opacity-60" />

      {/* Header kartu */}
      <div className="flex items-center justify-between mb-6">
        <span className="badge badge-info text-base px-4 py-1.5">
          📝 Soal {nomorSoal} dari {totalSoal}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSoal }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < nomorSoal - 1
                  ? "bg-green-400"
                  : i === nomorSoal - 1
                  ? "bg-yellow-400 scale-125"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Pertanyaan utama */}
      <div className="text-center mb-8">
        <p className="text-gray-500 text-lg mb-3 font-medium">
          Pilih ejaan yang <span className="font-bold text-blue-600">benar</span> untuk kata:
        </p>
        
        {/* Tombol Dengarkan */}
        <button
          id={`btn-dengarkan-${soal.id}`}
          onClick={handleDengarkan}
          className={`
            inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-xl font-bold
            transition-all duration-200 active:scale-95 shadow-btn hover:shadow-btn-hover
            ${isSpeaking
              ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white animate-pulse-glow"
              : "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-300 hover:to-blue-400"
            }
          `}
          title="Klik untuk mendengarkan kata"
        >
          <span className={`text-2xl ${isSpeaking ? "animate-wiggle" : ""}`}>
            🔊
          </span>
          <span>{isSpeaking ? "Sedang diputar..." : "Dengarkan"}</span>
        </button>

        <p className="text-sm text-gray-400 mt-2 italic">
          Klik untuk mendengarkan kata yang harus ditulis
        </p>
      </div>

      {/* Opsi jawaban */}
      <div className="grid gap-3">
        {soal.opsi_jawaban.map((opsi, idx) => (
          <button
            key={`${opsi}-${idx}`}
            id={`btn-opsi-${soal.id}-${idx}`}
            onClick={() => handlePilih(opsi)}
            disabled={feedbackStatus !== "idle"}
            className={getOpsiClass(opsi)}
          >
            <span className="font-mono tracking-widest">{opsi}</span>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedbackStatus !== "idle" && (
        <div
          className={`mt-6 rounded-2xl p-4 text-center text-lg font-bold animate-scale-in ${
            feedbackStatus === "benar"
              ? "bg-gradient-to-r from-green-50 to-mint-100 text-green-700 border-2 border-green-200"
              : "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-2 border-amber-200"
          }`}
        >
          {feedbackStatus === "benar" ? (
            <>
              <span className="text-2xl mr-2">🎉</span>
              Betul sekali! Kamu hebat!
              <span className="text-2xl ml-2">⭐</span>
            </>
          ) : (
            <>
              <span className="text-2xl mr-2">💪</span>
              Hampir! Coba dengarkan sekali lagi ya
              <span className="text-2xl ml-2">😊</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
