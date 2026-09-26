"use client";

import React, { useState, useEffect } from "react";
import { KartuProgres as KartuProgresType, SoalLatihan, JawabanAnak } from "@/types";
import { sfx } from "@/lib/soundEffects";
import ConfettiBurst from "./ConfettiBurst";
import MascotCharacter from "./MascotCharacter";
import SertifikatApresiasi from "./SertifikatApresiasi";

interface KartuProgresProps {
  progres: KartuProgresType;
  totalSoal: number;
  jumlahBenar: number;
  bintang: number;
  polaNama: string;
  daftarSoal?: SoalLatihan[];
  jawabanAnak?: JawabanAnak[];
  onLatihanBaru: () => void;
  loading?: boolean;
}

export default function KartuProgresComponent({
  progres,
  totalSoal,
  jumlahBenar,
  bintang,
  polaNama,
  daftarSoal = [],
  jawabanAnak = [],
  onLatihanBaru,
  loading = false,
}: KartuProgresProps) {
  const [showSertifikat, setShowSertifikat] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const persentase = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;
  const perluUlang = Math.max(0, totalSoal - jumlahBenar);

  // Mainkan efek suara perayaan saat pertama kali kartu progres dibuka
  useEffect(() => {
    sfx.playCelebration();
    const timer = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const getStars = () => {
    if (persentase > 90) return "⭐⭐⭐";
    if (persentase >= 75) return "⭐⭐";
    return "⭐";
  };

  const getGradient = () => {
    if (persentase > 90) return "from-green-400 via-emerald-400 to-teal-400";
    if (persentase >= 75) return "from-yellow-400 via-amber-400 to-orange-400";
    return "from-blue-400 via-indigo-400 to-purple-400";
  };

  // Dengarkan ulang kata di daftar review
  const playWordAudio = (word: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "id-ID";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="card animate-slide-up relative overflow-hidden">
      <ConfettiBurst trigger={showConfetti} />

      {/* Background Decor */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-5 rounded-3xl pointer-events-none`} />
      <div className="absolute top-4 right-4 text-7xl opacity-10 select-none pointer-events-none">🏆</div>

      {/* Maskot Kiko Wisuda */}
      <div className="flex justify-center -mt-2 mb-4">
        <MascotCharacter
          mood="celebrate"
          speechText={`Yaaay! Kamu berhasil mengumpulkan ${bintang} Bintang Belajar! 🌟`}
          size="md"
        />
      </div>

      {/* Header Kartu Progres */}
      <div className="text-center mb-6 relative">
        <h2
          className="text-3xl font-extrabold text-gray-800 mb-1"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          Kartu Progres Latihan
        </h2>
        <p className="text-gray-500 text-sm">
          Fokus Pola: <span className="font-bold text-blue-600">{polaNama}</span>
        </p>
      </div>

      {/* Skor Visual & Bintang */}
      <div className="bg-gradient-to-r from-gray-50 via-amber-50/40 to-blue-50 rounded-2xl p-5 mb-5 border border-amber-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-700 font-bold text-sm">Tingkat Capaian</span>
          <span className="text-2xl font-bold tracking-wider">{getStars()}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100">
            <div className="text-3xl font-extrabold text-green-600">{jumlahBenar}</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold">Tepat Sasaran</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-amber-100">
            <div className="text-3xl font-extrabold text-amber-500">{perluUlang}</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold">Perlu Latih Lagi</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-amber-200 bg-amber-50/50">
            <div className="text-3xl font-extrabold text-amber-600">{bintang} ⭐</div>
            <div className="text-xs text-gray-500 mt-1 font-semibold">Bintang Diperoleh</div>
          </div>
        </div>

        {/* Progress Bar Persentase */}
        <div className="progress-bar h-3.5">
          <div className="progress-fill" style={{ width: `${persentase}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
          <span>0%</span>
          <span className="font-bold text-gray-700">{persentase}% Akurasi Latihan</span>
          <span>100%</span>
        </div>
      </div>

      {/* Review Kata-Kata yang Baru Saja Dilatih */}
      {daftarSoal.length > 0 && (
        <div className="bg-white rounded-2xl p-4 mb-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span>📖</span>
              <span>Daftar Kata Sesi Ini ({daftarSoal.length} kata)</span>
            </h3>
            <span className="text-xs text-gray-400">Klik 🔊 untuk dengar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {daftarSoal.map((soal, idx) => {
              const jaw = jawabanAnak[idx];
              const isCorrect = jaw?.benar ?? false;

              return (
                <div
                  key={soal.id || idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-sm transition-all ${
                    isCorrect
                      ? "bg-green-50/60 border-green-200 text-green-900"
                      : "bg-amber-50/60 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono font-bold tracking-wide">
                    <span>{isCorrect ? "✅" : "🔄"}</span>
                    <span>{soal.jawaban_benar}</span>
                  </div>

                  <button
                    onClick={() => playWordAudio(soal.audio_text)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-100 flex items-center justify-center text-sm text-gray-600 transition-all active:scale-95"
                    title={`Dengarkan pelafalan "${soal.audio_text}"`}
                  >
                    🔊
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ringkasan Positif & Hangat dari AI */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">💬</span>
          <div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              Catatan Apresiasi
            </p>
            <p className="text-gray-800 leading-relaxed text-sm sm:text-base font-medium">
              {progres.ringkasan_positif}
            </p>
          </div>
        </div>
      </div>

      {/* Saran Konkret untuk Orang Tua / Guru */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 mb-6 border border-yellow-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">💡</span>
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              Saran Pendampingan
            </p>
            <p className="text-gray-800 leading-relaxed text-sm font-medium">
              {progres.saran_untuk_orang_tua}
            </p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi: Sertifikat & Latihan Baru */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          id="btn-buka-sertifikat"
          onClick={() => {
            sfx.playPop();
            setShowSertifikat(true);
          }}
          className="btn btn-secondary flex-1 justify-center py-3.5 text-base shadow-md"
        >
          <span className="text-xl">🏅</span>
          <span>Lihat Sertifikat Apresiasi</span>
        </button>

        <button
          id="btn-latihan-baru-dari-progres"
          onClick={onLatihanBaru}
          disabled={loading}
          className="btn btn-primary flex-1 justify-center py-3.5 text-base shadow-md"
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">⟳</span>
              <span>Membuat soal baru...</span>
            </>
          ) : (
            <>
              <span className="text-xl">🔄</span>
              <span>Latihan Baru (Kata Berbeda)</span>
            </>
          )}
        </button>
      </div>

      {/* Modal Sertifikat */}
      {showSertifikat && (
        <SertifikatApresiasi
          polaNama={polaNama}
          totalSoal={totalSoal}
          jumlahBenar={jumlahBenar}
          bintang={bintang}
          tingkatBintang={getStars()}
          onTutup={() => setShowSertifikat(false)}
        />
      )}
    </div>
  );
}
