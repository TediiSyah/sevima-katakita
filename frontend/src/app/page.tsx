"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PolaTarget, SoalLatihan, JawabanAnak, KartuProgres, SesiLatihan } from "@/types";
import { POLA_DEFAULT, FALLBACK_SOAL, FALLBACK_SOAL_FONOLOGIS } from "@/data/pola";
import PolaSelector from "@/components/PolaSelector";
import KartuSoal from "@/components/KartuSoal";
import KartuProgresComponent from "@/components/KartuProgres";
import LoadingSpinner from "@/components/LoadingSpinner";
import GamificationBar from "@/components/GamificationBar";
import MascotCharacter, { MascotMood } from "@/components/MascotCharacter";
import { getApiUrl } from "@/lib/api-config";
import { sfx } from "@/lib/soundEffects";

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

  // State Gamifikasi
  const [bintang, setBintang] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [floatingScore, setFloatingScore] = useState<number | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    "Halo sahabat! Aku Kiko, siap menemanimu belajar kata seru!"
  );

  const gameRef = useRef<HTMLDivElement>(null);

  // Callback ganti ekspresi maskot dari anak komponen
  const handleMascotMoodChange = useCallback((mood: MascotMood, speech?: string) => {
    setMascotMood(mood);
    if (speech) setMascotSpeech(speech);
  }, []);

  // ——————————————————————————————————
  // Generate soal dari AI (atau fallback)
  // ——————————————————————————————————
  const generateSoal = useCallback(
    async (pola: PolaTarget) => {
      sfx.playPop();
      setGamePhase("loading");
      setMascotMood("thinking");
      setMascotSpeech("Kiko sedang meminta bantuan AI menyiapkan kata-kata baru...");

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
      setComboStreak(0);
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
        setMascotMood("idle");
        setMascotSpeech("Kata baru sudah siap! Tekan tombol dengarkan ya!");
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
        setMascotMood("idle");
        setMascotSpeech("Kata-kata sudah siap! Ayo kita mulai dengarkan!");
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
      setMascotMood("celebrate");
      setMascotSpeech("Hebat sekali! Kiko sedang merangkum kartu apresiasimu...");

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

        if (persentase > 90) {
          ringkasan = `Luar biasa (⭐⭐⭐)! Dari ${totalSoal} kata latihan, ${jumlahBenar} sudah tepat. Semangat terus berlatih ya! 🌟`;
          saran =
            "Coba latihan dengan kata-kata baru besok untuk terus memperkuat kemampuan yang sudah bagus ini.";
        } else if (persentase >= 75) {
          ringkasan = `Bagus sekali (⭐⭐)! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Beberapa kata masih butuh latihan lagi, dan itu wajar banget di tahap belajar ini. 😊`;
          saran =
            "Ulangi latihan ini 2-3 kali dengan kata yang berbeda, sambil ajak anak mengucapkan huruf yang mirip satu per satu.";
        } else {
          ringkasan = `Keren sudah mencoba (⭐)! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Ini baru awal latihan — semakin sering berlatih, semakin lancar! 💪`;
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

      // Tambah bintang & hitung combo
      if (benar) {
        const poinDidapat = 10 + (comboStreak >= 1 ? comboStreak * 5 : 0);
        setBintang((prev) => prev + poinDidapat);
        setComboStreak((prev) => prev + 1);
        setFloatingScore(poinDidapat);
        setTimeout(() => setFloatingScore(null), 1200);
      } else {
        setComboStreak(0);
      }

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
    [sesi, soalAktifIdx, comboStreak, generateProgres]
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
      sfx.playPop();
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
      {/* Background Decor */}
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
        <header className="text-center py-2">
          <div className="flex justify-center mb-2">
            <MascotCharacter
              mood={mascotMood}
              speechText={mascotSpeech}
              size="md"
            />
          </div>
          <h1
            className="text-4xl font-extrabold mb-1"
            style={{ fontFamily: "var(--font-baloo)" }}
          >
            <span className="text-gradient">KataKita</span>
            <span className="text-gray-800"> — Sahabat Latihan Baca-Tulis</span>
          </h1>
          <p className="text-gray-600 text-base max-w-md mx-auto leading-relaxed">
            Latihan membaca & mengeja adaptif ramah anak, didukung kecerdasan buatan Gemini AI.
          </p>
        </header>

        {/* ——————————————————————————————————
            BAR GAMIFIKASI (Bintang & Combo)
        —————————————————————————————————— */}
        {(gamePhase === "game" || gamePhase === "progres" || bintang > 0) && (
          <GamificationBar
            bintang={bintang}
            comboStreak={comboStreak}
            soalAktif={Math.min(soalAktifIdx + 1, sesi.daftar_soal.length || 6)}
            totalSoal={sesi.daftar_soal.length || 6}
            floatingScore={floatingScore}
          />
        )}

        {/* ——————————————————————————————————
            CATATAN ETIS
        —————————————————————————————————— */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 flex gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-blue-800 font-semibold text-sm mb-0.5">
              Alat bantu latihan, bukan alat diagnosis
            </p>
            <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
              Aplikasi ini membantu melatih pola baca-tulis yang <em>sudah diketahui atau dicurigai</em>{" "}
              oleh orang tua atau guru. Soal bervariasi setiap kali dibuat agar latihan terus menyenangkan.
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
                  <span>Mulai Latihan Baru!</span>
                </>
              ) : gamePhase === "loading" ? (
                <>
                  <span className="animate-spin text-xl">⟳</span>
                  <span>Sedang menyiapkan kata...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🔄</span>
                  <span>Latihan Baru (Kata Berbeda)</span>
                </>
              )}
            </button>

            {gamePhase !== "welcome" && gamePhase !== "loading" && (
              <button
                id="btn-lihat-progres"
                onClick={() => {
                  if (sesi.jawaban_anak.length >= 3) {
                    generateProgres(sesi.jawaban_anak, sesi.pola_target.nama);
                  } else {
                    alert(
                      `Selesaikan minimal 3 kata dulu ya! Baru ${sesi.jawaban_anak.length} kata selesai.`
                    );
                  }
                }}
                disabled={sesi.jawaban_anak.length < 3 || gamePhase === "progres"}
                className="btn btn-secondary btn-large sm:flex-initial flex-1 justify-center"
              >
                <span className="text-xl">📊</span>
                <span>Kartu Progres</span>
              </button>
            )}
          </div>

          {/* Indikator fallback */}
          {fromFallback && gamePhase === "game" && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2 border border-amber-200">
              <span>⚠️</span>
              <span>
                Menggunakan bank kata cadangan (offline mode). Kata tetap variatif dan efektif.
              </span>
            </div>
          )}
        </div>

        {/* ——————————————————————————————————
            AREA GAME UTAMA
        —————————————————————————————————— */}
        <div ref={gameRef}>
          {gamePhase === "loading" && (
            <LoadingSpinner message="AI Gemini sedang merancang kata-kata baru..." />
          )}

          {gamePhase === "game" && soalAktif && (
            <div className="animate-fade-in">
              <KartuSoal
                key={`${soalAktif.id}-${soalAktifIdx}`}
                soal={soalAktif}
                nomorSoal={soalAktifIdx + 1}
                totalSoal={sesi.daftar_soal.length}
                comboStreak={comboStreak}
                onJawab={handleJawab}
                onMascotMoodChange={handleMascotMoodChange}
              />
            </div>
          )}

          {gamePhase === "progres" && sesi.loading_progres && (
            <LoadingSpinner message="AI sedang merangkum apresiasi kartu progres..." />
          )}

          {gamePhase === "progres" && !sesi.loading_progres && sesi.kartu_progres && (
            <KartuProgresComponent
              progres={sesi.kartu_progres}
              totalSoal={sesi.jawaban_anak.length}
              jumlahBenar={jumlahBenar}
              bintang={bintang}
              polaNama={sesi.pola_target.nama}
              daftarSoal={sesi.daftar_soal}
              jawabanAnak={sesi.jawaban_anak}
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
            <h2
              className="text-2xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "var(--font-baloo)" }}
            >
              Cara Asyik Bermain & Belajar
            </h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
              Pilih pola latihan di atas, lalu tekan{" "}
              <strong className="text-amber-600">Mulai Latihan Baru</strong> untuk mendengar kata dan mengumpulkan bintang!
            </p>

            {/* Langkah bermain */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
              {[
                { icon: "🎯", label: "Pilih Pola Latihan" },
                { icon: "🔊", label: "Dengarkan Kata" },
                { icon: "⭐", label: "Kumpulkan Bintang" },
              ].map((step, i) => (
                <div key={i} className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3">
                  <div className="text-2xl mb-1">{step.icon}</div>
                  <div className="text-xs text-gray-700 font-bold leading-tight">
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
        <footer className="text-center text-xs text-gray-400 pb-6 space-y-1">
          <p>🌟 Dibuat untuk mendukung SDG 4 — Pendidikan Berkualitas</p>
          <p>Platform Latihan Membaca & Mengeja Adaptif Berbasis AI</p>
        </footer>
      </div>
    </div>
  );
}
