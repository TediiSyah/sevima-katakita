"use client";

import React, { useState } from "react";

interface SertifikatApresiasiProps {
  namaAnak?: string;
  polaNama: string;
  totalSoal: number;
  jumlahBenar: number;
  bintang: number;
  tingkatBintang?: string;
  onTutup?: () => void;
}

export default function SertifikatApresiasi({
  namaAnak: defaultNama = "Bintang Cilik",
  polaNama,
  totalSoal,
  jumlahBenar,
  bintang,
  tingkatBintang,
  onTutup,
}: SertifikatApresiasiProps) {
  const [nama, setNama] = useState(defaultNama);
  const [isEditing, setIsEditing] = useState(false);

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border-4 border-amber-300 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Tombol Tutup (Hidden when print) */}
        {onTutup && (
          <button
            onClick={onTutup}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold flex items-center justify-center transition-all print:hidden"
          >
            ✕
          </button>
        )}

        {/* ============================================================ */}
        {/* KONTEN SERTIFIKAT (Printable) */}
        {/* ============================================================ */}
        <div className="border-4 border-dashed border-amber-300 rounded-2xl p-6 sm:p-8 text-center bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative overflow-hidden">
          
          {/* Pita Emas Pojok */}
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-gradient-to-br from-amber-400 to-yellow-300 rotate-45 transform pointer-events-none opacity-40" />
          <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-gradient-to-br from-amber-400 to-yellow-300 rotate-45 transform pointer-events-none opacity-40" />

          {/* Badge Medali */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white">
              🏅
            </div>
          </div>

          <h3
            className="text-xs uppercase tracking-widest font-extrabold text-amber-600 mb-1"
          >
            Piagam Penghargaan Literasi
          </h3>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            Bintang Membaca KataKita
          </h2>

          <p className="text-gray-500 text-sm mb-2">Diberikan dengan bangga kepada:</p>

          {/* Nama Anak (bisa diklik untuk ubah nama) */}
          <div className="my-3 flex justify-center items-center gap-2">
            {isEditing ? (
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                autoFocus
                className="text-2xl sm:text-3xl font-extrabold text-blue-700 text-center border-b-2 border-blue-500 focus:outline-none bg-transparent px-3 py-1"
              />
            ) : (
              <div
                onClick={() => setIsEditing(true)}
                className="text-2xl sm:text-3xl font-extrabold text-blue-700 hover:text-blue-800 cursor-pointer border-b-2 border-transparent hover:border-blue-300 transition-all px-3 py-1"
                title="Klik untuk mengubah nama anak"
              >
                {nama} <span className="text-sm text-gray-400 print:hidden">✏️</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed my-4">
            Telah berhasil menyelesaikan latihan membaca & mengeja kata pada modul{" "}
            <span className="font-bold text-gray-800">{polaNama}</span> dengan tekun,
            semangat, dan penuh keceriaan.
          </p>

          {/* Skor Ringkasan */}
          <div className="inline-flex flex-wrap justify-center items-center gap-4 sm:gap-6 bg-white/80 rounded-2xl px-5 py-3 border border-amber-200 shadow-sm my-3">
            <div>
              <div className="text-xs text-gray-400">Tingkat Capaian</div>
              <div className="text-lg sm:text-xl font-bold tracking-wider">
                {tingkatBintang || "⭐⭐⭐"}
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-amber-200" />
            <div>
              <div className="text-xs text-gray-400">Kata Tepat</div>
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {jumlahBenar} / {totalSoal}
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-amber-200" />
            <div>
              <div className="text-xs text-gray-400">Poin Belajar</div>
              <div className="text-lg sm:text-xl font-bold text-amber-500">
                {bintang} ⭐
              </div>
            </div>
          </div>

          {/* Footer Sertifikat */}
          <div className="mt-8 pt-4 border-t border-amber-100 flex justify-between items-end text-left">
            <div>
              <div className="text-xs text-gray-400">Tanggal:</div>
              <div className="text-xs font-semibold text-gray-600">{tanggal}</div>
            </div>
            <div className="text-center">
              <div className="font-script text-lg text-amber-800 font-bold italic mb-1">
                KataKita Belajar
              </div>
              <div className="w-32 border-t border-gray-400 mx-auto" />
              <div className="text-xs text-gray-400 mt-1">Tim Sahabat Literasi</div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi di Bawah (Print / Download) */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="btn btn-primary flex-1 justify-center py-3 text-base shadow-md"
          >
            <span>🖨️</span>
            <span>Cetak / Simpan PDF Sertifikat</span>
          </button>
          {onTutup && (
            <button
              onClick={onTutup}
              className="btn btn-secondary py-3 text-base justify-center"
            >
              Kembali ke Kartu Progres
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
