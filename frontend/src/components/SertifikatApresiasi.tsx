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
  tingkatBintang = "⭐⭐⭐",
  onTutup,
}: SertifikatApresiasiProps) {
  const [nama, setNama] = useState(defaultNama);
  const [isEditing, setIsEditing] = useState(false);

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(new Date());

  const nomorSertifikat = `KK/LIT-${new Date().getFullYear()}/${String(bintang).padStart(3, "0")}`;

  const handlePrint = () => {
    setIsEditing(false);

    // Membuka window khusus cetak
    const printWindow = window.open("", "_blank", "width=960,height=720");
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <title>Sertifikat Literasi — ${nama}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            /* Margin 0 menghilangkan header 'about:blank' & tanggal bawaan browser */
            @page {
              size: A4 landscape;
              margin: 0;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 12mm;
              background: #ffffff;
              font-family: 'Nunito', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .cert-box {
              width: 100%;
              max-width: 900px;
              border: 4px dashed #F59E0B;
              border-radius: 24px;
              padding: 30px 40px;
              text-align: center;
              background: linear-gradient(to bottom, rgba(254, 243, 199, 0.5), #FFFFFF, rgba(254, 243, 199, 0.35));
              position: relative;
              overflow: hidden;
              box-shadow: none;
            }
            .font-baloo {
              font-family: 'Baloo 2', cursive, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="cert-box">
            <!-- Badge Pojok Kanan Atas -->
            <div style="position: absolute; top: 16px; right: 20px; z-index: 10; background: rgba(255, 255, 255, 0.92); border: 1.5px solid #FCD34D; border-radius: 12px; padding: 4px 12px; text-align: right; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
              <div style="font-size: 11px; font-weight: 800; color: #1E40AF;">⭐ Sertifikat Literasi — ${nama}</div>
              <div style="font-size: 9px; font-weight: 600; color: #9CA3AF;">No: ${nomorSertifikat}</div>
            </div>

            <!-- Pita Emas Pojok Kiri & Kanan Bawah -->
            <div style="position: absolute; top: -45px; left: -45px; width: 110px; height: 110px; background: linear-gradient(135deg, #F59E0B, #FDE047); transform: rotate(45deg); opacity: 0.35;"></div>
            <div style="position: absolute; bottom: -45px; right: -45px; width: 110px; height: 110px; background: linear-gradient(135deg, #F59E0B, #FDE047); transform: rotate(45deg); opacity: 0.35;"></div>

            <!-- Badge Medali -->
            <div style="display: flex; justify-content: center; margin-bottom: 10px; margin-top: 6px;">
              <div style="width: 62px; height: 62px; border-radius: 50%; background: linear-gradient(135deg, #FBBF24, #F59E0B); display: flex; align-items: center; justify-content: center; font-size: 32px; border: 2px solid white; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">
                🏅
              </div>
            </div>

            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; color: #D97706; margin-bottom: 4px;">
              PIAGAM PENGHARGAAN LITERASI
            </div>

            <h1 class="font-baloo" style="font-size: 32px; font-weight: 800; color: #1F2937; margin: 0 0 10px 0; line-height: 1.2;">
              Bintang Membaca KataKita
            </h1>

            <p style="font-size: 13px; color: #6B7280; margin: 0 0 4px 0;">
              Diberikan dengan bangga kepada:
            </p>

            <div style="font-size: 30px; font-weight: 800; color: #1D4ED8; margin: 6px 0 10px 0; text-decoration: underline; text-decoration-color: #93C5FD;">
              ${nama}
            </div>

            <p style="font-size: 13px; color: #4B5563; max-width: 540px; margin: 0 auto 16px auto; line-height: 1.5;">
              Telah berhasil menyelesaikan latihan membaca & mengeja kata pada modul 
              <strong style="color: #1F2937;">${polaNama}</strong> dengan tekun, semangat, dan penuh keceriaan.
            </p>

            <!-- Skor Ringkasan -->
            <div style="display: inline-flex; align-items: center; gap: 24px; background: rgba(255, 255, 255, 0.9); border: 1.5px solid #FDE68A; border-radius: 16px; padding: 10px 24px; margin-bottom: 16px;">
              <div>
                <div style="font-size: 11px; color: #9CA3AF;">Tingkat Capaian</div>
                <div style="font-size: 16px; font-weight: 800; letter-spacing: 2px;">${tingkatBintang}</div>
              </div>
              <div style="width: 1px; height: 28px; background: #FDE68A;"></div>
              <div>
                <div style="font-size: 11px; color: #9CA3AF;">Kata Tepat</div>
                <div style="font-size: 16px; font-weight: 800; color: #16A34A;">${jumlahBenar} / ${totalSoal}</div>
              </div>
              <div style="width: 1px; height: 28px; background: #FDE68A;"></div>
              <div>
                <div style="font-size: 11px; color: #9CA3AF;">Poin Belajar</div>
                <div style="font-size: 16px; font-weight: 800; color: #D97706;">${bintang} ⭐</div>
              </div>
            </div>

            <!-- Footer Tanda Tangan -->
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #FEF3C7; display: flex; justify-content: space-between; align-items: flex-end; text-align: left;">
              <div>
                <div style="font-size: 11px; color: #9CA3AF;">Tanggal Terbit:</div>
                <div style="font-size: 12px; font-weight: 700; color: #4B5563;">${tanggal}</div>
              </div>
              <div style="text-align: center;">
                <div style="font-family: 'Baloo 2', cursive; font-size: 16px; font-weight: 800; color: #92400E; margin-bottom: 2px;">
                  KataKita Belajar
                </div>
                <div style="width: 130px; border-top: 1.5px solid #9CA3AF; margin: 0 auto 3px auto;"></div>
                <div style="font-size: 10px; color: #9CA3AF;">Tim Sahabat Literasi</div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 300);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border-4 border-amber-300">
        
        {/* Tombol Tutup */}
        {onTutup && (
          <button
            onClick={onTutup}
            aria-label="Tutup modal sertifikat"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-all z-20"
          >
            ✕
          </button>
        )}

        {/* ============================================================ */}
        {/* KONTEN SERTIFIKAT (Di Layar Modal) */}
        {/* ============================================================ */}
        <div
          id="printable-sertifikat"
          className="border-4 border-dashed border-amber-300 rounded-2xl p-6 sm:p-8 text-center bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 relative overflow-hidden shadow-inner"
        >
          {/* Badge Pojok Kanan Atas */}
          <div className="absolute top-3.5 right-4 z-10 bg-white/90 border border-amber-300 rounded-xl px-3 py-1 text-right shadow-sm hidden sm:block">
            <div className="text-xs font-extrabold text-blue-800">⭐ Sertifikat Literasi — {nama}</div>
            <div className="text-[10px] font-semibold text-gray-400">No: {nomorSertifikat}</div>
          </div>

          {/* Pita Emas Pojok */}
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-gradient-to-br from-amber-400 to-yellow-300 rotate-45 transform pointer-events-none opacity-40" />
          <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-gradient-to-br from-amber-400 to-yellow-300 rotate-45 transform pointer-events-none opacity-40" />

          {/* Badge Medali */}
          <div className="flex justify-center mb-3 mt-1 sm:mt-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white">
              🏅
            </div>
          </div>

          <h3 className="text-xs uppercase tracking-widest font-extrabold text-amber-600 mb-1">
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
                {nama} <span className="text-sm text-gray-400">✏️</span>
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
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="btn btn-primary flex-1 justify-center py-3 text-base shadow-md font-extrabold"
          >
            <span>🖨️</span>
            <span>Cetak / Simpan PDF Sertifikat</span>
          </button>
          {onTutup && (
            <button
              onClick={onTutup}
              className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-3 text-base justify-center font-bold"
            >
              Kembali ke Kartu Progres
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
