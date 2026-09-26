"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PolaTarget, SoalLatihan, JawabanAnak, KartuProgres, SesiLatihan } from "@/types";
import { POLA_DEFAULT, FALLBACK_SOAL, FALLBACK_SOAL_FONOLOGIS } from "@/data/pola";
import PolaSelector from "@/components/PolaSelector";
import KartuSoal from "@/components/KartuSoal";
import KartuProgresComponent from "@/components/KartuProgres";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getApiUrl } from "@/lib/api-config";

// ============================================================
// Helper: acak urutan opsi jawaban untuk setiap sesi
// ============================================================
function shuffleOpsi(soal: SoalLatihan[]): SoalLatihan[] {
  return soal.map((s) => ({
    ...s,
    opsi_jawaban: [...s.opsi_jawaban].sort(() => Math.random() - 0.5),
  }));
}

// ============================================================
// Komponen Utama
// ============================================================
export default function HomePage() {
  const [polaTerpilih, setPolaTerpilih] = useState<PolaTarget>(POLA_DEFAULT);
  const [sesi, setSesi] = useState<SesiLatihan>({
    pola_target: POLA_DEFAULT,
    daftar_soal: [],
    jawaban_anak: [],
    kartu_progres: null,
    loading_soal: false,
    loading_progres: false,
    error: null,
  });

  const [soalAktifIdx, setSoalAktifIdx] = useState(0);
  const [gamePhase, setGamePhase] = useState<"welcome" | "loading" | "game" | "progres">(
    "welcome"
  );
  const [fromFallback, setFromFallback] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  // ——————————————————————————————————
  // Generate soal dari AI (atau fallback)
  // ——————————————————————————————————
  const generateSoal = useCallback(
    async (pola: PolaTarget) => {
      setGamePhase("loading");
      setSesi((prev) => ({
        ...prev,
        pola_target: pola,
        daftar_soal: [],
        jawaban_anak: [],
        kartu_progres: null,
        loading_soal: true,
        error: null,
      }));
      setSoalAktifIdx(0);
      setFromFallback(false);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const res = await fetch(getApiUrl("/api/generate-soal"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pola_id: pola.id,
            pola_nama: pola.nama,
            jumlah_soal: 6,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const soal: SoalLatihan[] = shuffleOpsi(data.soal);

        setSesi((prev) => ({
          ...prev,
          daftar_soal: soal,
          loading_soal: false,
        }));
        setFromFallback(!data.from_ai);
        setGamePhase("game");
      } catch {
        // Fallback ke soal statis
        const fallback =
          pola.id === "kesalahan_fonologis" ? FALLBACK_SOAL_FONOLOGIS : FALLBACK_SOAL;
        const shuffled = shuffleOpsi([...fallback].sort(() => Math.random() - 0.5));

        setSesi((prev) => ({
          ...prev,
          daftar_soal: shuffled,
          loading_soal: false,
          error: null,
        }));
        setFromFallback(true);
        setGamePhase("game");
      }
    },
    []
  );

  // ——————————————————————————————————
  // Generate kartu progres
  // ——————————————————————————————————
  const generateProgres = useCallback(
    async (jawaban: JawabanAnak[], polaNama: string) => {
      const jumlahBenar = jawaban.filter((j) => j.benar).length;
      const totalSoal = jawaban.length;

      setSesi((prev) => ({
        ...prev,
        loading_progres: true,
        kartu_progres: null,
      }));
      setGamePhase("progres");

      try {
        const res = await fetch(getApiUrl("/api/kartu-progres"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pola_target: polaNama,
            total_soal: totalSoal,
            jumlah_benar: jumlahBenar,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: KartuProgres = await res.json();

        setSesi((prev) => ({
          ...prev,
          kartu_progres: data,
          loading_progres: false,
        }));
      } catch {
        // Fallback kartu progres statis
        const persentase =
          totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;
        let ringkasan: string;
        let saran: string;

        if (persentase >= 80) {
          ringkasan = `Luar biasa! Dari ${totalSoal} kata latihan, ${jumlahBenar} sudah tepat. Semangat terus berlatih ya! 🌟`;
          saran =
            "Coba latihan dengan kata-kata baru besok untuk terus memperkuat kemampuan yang sudah bagus ini.";
        } else if (persentase >= 50) {
          ringkasan = `Bagus! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Beberapa kata masih butuh latihan lagi, dan itu wajar banget di tahap belajar ini. 😊`;
          saran =
            "Ulangi latihan ini 2-3 kali dengan kata yang berbeda, sambil ajak anak mengucapkan huruf yang mirip satu per satu.";
        } else {
          ringkasan = `Keren sudah mencoba! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Ini baru awal latihan — semakin sering berlatih, semakin lancar! 💪`;
          saran =
            "Lakukan latihan singkat ini setiap hari selama 5-10 menit. Konsistensi lebih penting dari durasi yang panjang.";
        }

        setSesi((prev) => ({
          ...prev,
          kartu_progres: {
            ringkasan_positif: ringkasan,
            saran_untuk_orang_tua: saran,
          },
          loading_progres: false,
        }));
      }
    },
    []
  );

  // ——————————————————————————————————
  // Handler: jawab soal
  // ——————————————————————————————————
  const handleJawab = useCallback(
    (jawaban: string, benar: boolean) => {
      const soalSaatIni = sesi.daftar_soal[soalAktifIdx];
      const jawabanBaru: JawabanAnak = {
        soal_id: soalSaatIni.id,
        jawaban_dipilih: jawaban,
        benar,
      };

      const jawabanBaruList = [...sesi.jawaban_anak, jawabanBaru];
      const isLastSoal = soalAktifIdx >= sesi.daftar_soal.length - 1;

      setSesi((prev) => ({
        ...prev,
        jawaban_anak: jawabanBaruList,
      }));

      if (isLastSoal) {
        // Semua soal selesai — generate progres
        generateProgres(jawabanBaruList, sesi.pola_target.nama);
      } else {
        setSoalAktifIdx((prev) => prev + 1);
      }
    },
    [sesi, soalAktifIdx, generateProgres]
  );

  // ——————————————————————————————————
  // Handler: latihan baru
  // ——————————————————————————————————
  const handleLatihanBaru = useCallback(() => {
    generateSoal(polaTerpilih);
  }, [generateSoal, polaTerpilih]);

  // ——————————————————————————————————
  // Handler: ganti pola
  // ——————————————————————————————————
  const handleGantiPola = useCallback(
    (pola: PolaTarget) => {
      setPolaTerpilih(pola);
    },
    []
  );

  // Auto-scroll ke game saat mulai
  useEffect(() => {
    if (gamePhase === "game" && gameRef.current) {
      setTimeout(() => {
        gameRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [gamePhase, soalAktifIdx]);

  // ============================================================
  // Render
  // ============================================================
  const soalAktif = sesi.daftar_soal[soalAktifIdx];
  const jumlahBenar = sesi.jawaban_anak.filter((j) => j.benar).length;

  return (
    <div className="min-h-screen">
      {/* ——————————————————————————————————
          Background decorasi mengambang
      —————————————————————————————————— */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 text-6xl floating opacity-20 select-none">📚</div>
        <div className="absolute top-40 right-16 text-5xl floating-delayed opacity-15 select-none">✏️</div>
        <div className="absolute bottom-40 left-20 text-4xl floating opacity-20 select-none">🎯</div>
        <div className="absolute bottom-20 right-10 text-5xl floating-delayed opacity-15 select-none">⭐</div>
        <div className="absolute top-1/2 left-1/2 text-7xl floating opacity-5 select-none -translate-x-1/2 -translate-y-1/2">🌈</div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        {/* ——————————————————————————————————
            HERO HEADER
        —————————————————————————————————— */}
        <header className="text-center py-4">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <span className="text-6xl floating select-none">📖</span>
              <span className="absolute -top-1 -right-2 text-2xl floating-delayed select-none">✨</span>
            </div>
          </div>
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            <span className="text-gradient">Generator Latihan</span>
            <br />
            <span className="text-gray-800">Pola Baca-Tulis</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            Latihan baca-tulis yang seru dan tepat sasaran,{" "}
            <strong>disesuaikan dengan pola</strong> yang sudah diketahui orang tua atau guru.
          </p>
        </header>

        {/* ——————————————————————————————————
            CATATAN ETIS (wajib tampil)
        —————————————————————————————————— */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 flex gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-blue-800 font-semibold text-sm mb-1">
              Alat bantu latihan, bukan alat diagnosis
            </p>
            <p className="text-blue-700 text-sm leading-relaxed">
              Aplikasi ini membantu melatih pola baca-tulis yang <em>sudah diketahui atau dicurigai</em>{" "}
              oleh orang tua, guru, atau psikolog — bukan untuk menyimpulkan kondisi apa pun dari anak.
              Setiap soal yang dihasilkan AI selalu baru dan berbeda supaya latihan terus efektif.
            </p>
          </div>
        </div>

        {/* ——————————————————————————————————
            PANEL PILIH POLA + TOMBOL MULAI
        —————————————————————————————————— */}
        <div className="card">
          <PolaSelector
            selected={polaTerpilih}
            onChange={handleGantiPola}
            disabled={gamePhase === "loading"}
          />

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              id="btn-mulai-latihan"
              onClick={() => generateSoal(polaTerpilih)}
              disabled={gamePhase === "loading"}
              className="btn btn-primary btn-large flex-1 justify-center"
            >
              {gamePhase === "welcome" ? (
                <>
                  <span className="text-2xl">🚀</span>
                  <span>Mulai Latihan!</span>
                </>
              ) : gamePhase === "loading" ? (
                <>
                  <span className="animate-spin text-xl">⟳</span>
                  <span>Sedang menyiapkan...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🔄</span>
                  <span>Latihan Baru</span>
                </>
              )}
            </button>

            {gamePhase !== "welcome" && gamePhase !== "loading" && (
              <button
                id="btn-lihat-progres"
                onClick={() => {
                  if (sesi.jawaban_anak.length >= 5) {
                    generateProgres(sesi.jawaban_anak, sesi.pola_target.nama);
                  } else {
                    alert(
                      `Selesaikan minimal 5 soal dulu ya! Baru ${sesi.jawaban_anak.length} soal selesai.`
                    );
                  }
                }}
                disabled={sesi.jawaban_anak.length < 5 || gamePhase === "progres"}
                className="btn btn-secondary btn-large sm:flex-initial flex-1 justify-center"
              >
                <span className="text-xl">📊</span>
                <span>Lihat Kartu Progres</span>
              </button>
            )}
          </div>

          {/* Mini progres tracker */}
          {gamePhase === "game" && sesi.daftar_soal.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>
                  Soal {Math.min(soalAktifIdx + 1, sesi.daftar_soal.length)} dari{" "}
                  {sesi.daftar_soal.length}
                </span>
                <span className="text-green-600 font-semibold">
                  ✅ {jumlahBenar} benar
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(sesi.jawaban_anak.length / sesi.daftar_soal.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Indikator fallback */}
          {fromFallback && gamePhase === "game" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
              <span>⚠️</span>
              <span>
                Menggunakan soal cadangan (AI tidak tersedia). Soal tetap beragam dan efektif.
              </span>
            </div>
          )}
        </div>

        {/* ——————————————————————————————————
            AREA GAME
        —————————————————————————————————— */}
        <div ref={gameRef}>
          {gamePhase === "loading" && (
            <LoadingSpinner message="AI sedang membuat soal latihan baru..." />
          )}

          {gamePhase === "game" && soalAktif && (
            <div className="animate-fade-in">
              <KartuSoal
                key={`${soalAktif.id}-${soalAktifIdx}`}
                soal={soalAktif}
                nomorSoal={soalAktifIdx + 1}
                totalSoal={sesi.daftar_soal.length}
                onJawab={handleJawab}
              />
            </div>
          )}

          {gamePhase === "progres" && sesi.loading_progres && (
            <LoadingSpinner message="AI sedang menyiapkan kartu progres..." />
          )}

          {gamePhase === "progres" && !sesi.loading_progres && sesi.kartu_progres && (
            <KartuProgresComponent
              progres={sesi.kartu_progres}
              totalSoal={sesi.jawaban_anak.length}
              jumlahBenar={jumlahBenar}
              polaNama={sesi.pola_target.nama}
              onLatihanBaru={handleLatihanBaru}
              loading={sesi.loading_soal}
            />
          )}
        </div>

        {/* ——————————————————————————————————
            WELCOME STATE
        —————————————————————————————————— */}
        {gamePhase === "welcome" && (
          <div className="card text-center py-8 animate-fade-in">
            <div className="text-5xl mb-4 floating select-none">🎮</div>
            <h2
              className="text-2xl font-bold text-gray-800 mb-3"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Siap Mulai Berlatih?
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Pilih pola latihan di atas, lalu tekan{" "}
              <strong className="text-yellow-600">Mulai Latihan</strong> — AI akan
              langsung membuatkan soal-soal baru khusus untukmu!
            </p>

            {/* Cara main */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center">
              {[
                { icon: "🎯", label: "Pilih pola kesulitan" },
                { icon: "👂", label: "Dengarkan katanya" },
                { icon: "✅", label: "Pilih ejaan yang tepat" },
              ].map((step, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-3">
                  <div className="text-2xl mb-1">{step.icon}</div>
                  <div className="text-xs text-gray-600 font-medium leading-tight">
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ——————————————————————————————————
            FOOTER
        —————————————————————————————————— */}
        <footer className="text-center text-xs text-gray-400 pb-4 space-y-1">
          <p>
            🌟 Dibuat untuk mendukung SDG 4 — Pendidikan Berkualitas
          </p>
          <p>
            Generator soal bertenaga AI untuk latihan Bahasa Indonesia yang terus bervariasi
          </p>
        </footer>
      </div>
    </div>
  );
}
