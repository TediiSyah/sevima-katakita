"use client";

import { KartuProgres as KartuProgresType } from "@/types";

interface KartuProgresProps {
  progres: KartuProgresType;
  totalSoal: number;
  jumlahBenar: number;
  polaNama: string;
  onLatihanBaru: () => void;
  loading?: boolean;
}

export default function KartuProgresComponent({
  progres,
  totalSoal,
  jumlahBenar,
  polaNama,
  onLatihanBaru,
  loading = false,
}: KartuProgresProps) {
  const persentase = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;
  const perluUlang = totalSoal - jumlahBenar;

  const getStars = () => {
    if (persentase >= 90) return "⭐⭐⭐";
    if (persentase >= 60) return "⭐⭐";
    return "⭐";
  };

  const getGradient = () => {
    if (persentase >= 80) return "from-green-400 via-emerald-400 to-teal-400";
    if (persentase >= 50) return "from-yellow-400 via-amber-400 to-orange-400";
    return "from-blue-400 via-indigo-400 to-purple-400";
  };

  return (
    <div className="card animate-slide-up relative overflow-hidden">
      {/* Background decorasi */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-5 rounded-3xl`} />
      <div className="absolute top-4 right-4 text-6xl opacity-10 select-none">🌟</div>

      {/* Header kartu progres */}
      <div className="text-center mb-6 relative">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full 
                      bg-gradient-to-br ${getGradient()} text-4xl mb-3 shadow-lg`}
        >
          {persentase >= 80 ? "🏆" : persentase >= 50 ? "🎯" : "💪"}
        </div>
        <h2
          className="text-2xl font-bold text-gray-800 mb-1"
          style={{ fontFamily: "var(--font-baloo)" }}
        >
          Kartu Progres Latihan
        </h2>
        <p className="text-gray-500 text-sm">
          Pola: <span className="font-semibold text-blue-600">{polaNama}</span>
        </p>
      </div>

      {/* Skor visual */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 font-medium">Hasil Latihan</span>
          <span className="text-2xl font-bold text-gray-800">{getStars()}</span>
        </div>

        <div className="flex gap-4 text-center mb-3">
          <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{jumlahBenar}</div>
            <div className="text-sm text-gray-500 mt-1">Sudah tepat</div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-amber-500">{perluUlang}</div>
            <div className="text-sm text-gray-500 mt-1">Perlu latihan lagi</div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-3 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{totalSoal}</div>
            <div className="text-sm text-gray-500 mt-1">Total kata</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${persentase}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span className="font-semibold text-gray-600">{persentase}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Ringkasan positif dari AI */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💬</span>
          <p className="text-gray-700 leading-relaxed text-base">
            {progres.ringkasan_positif}
          </p>
        </div>
      </div>

      {/* Saran untuk orang tua */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-6 border border-yellow-100">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-bold text-amber-700 mb-1">
              Saran untuk Orang Tua / Guru:
            </p>
            <p className="text-gray-700 leading-relaxed text-sm">
              {progres.saran_untuk_orang_tua}
            </p>
          </div>
        </div>
      </div>

      {/* Tombol aksi */}
      <button
        id="btn-latihan-baru-dari-progres"
        onClick={onLatihanBaru}
        disabled={loading}
        className="btn btn-primary btn-large w-full justify-center"
      >
        {loading ? (
          <>
            <span className="animate-spin text-xl">⟳</span>
            <span>Membuat soal baru...</span>
          </>
        ) : (
          <>
            <span className="text-xl">🔄</span>
            <span>Latihan Baru dengan Kata Berbeda!</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-3">
        Setiap latihan baru menghasilkan kata-kata yang berbeda ✨
      </p>
    </div>
  );
}
