"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PolaTarget, SoalLatihan, JawabanAnak, KartuProgres, SesiLatihan } from "@/types";
import { POLA_DEFAULT, DAFTAR_POLA, FALLBACK_SOAL, FALLBACK_SOAL_FONOLOGIS } from "@/data/pola";
import KartuSoal from "@/components/KartuSoal";
import KartuProgresComponent from "@/components/KartuProgres";
import LoadingSpinner from "@/components/LoadingSpinner";
import GamificationBar from "@/components/GamificationBar";
import MascotCharacter, { MascotMood } from "@/components/MascotCharacter";
import { getApiUrl } from "@/lib/api-config";
import { sfx } from "@/lib/soundEffects";

function shuffleOpsi(soal: SoalLatihan[]): SoalLatihan[] {
  return soal.map((s) => ({
    ...s,
    opsi_jawaban: [...s.opsi_jawaban].sort(() => Math.random() - 0.5),
  }));
}

// Bentuk geometris dekoratif di background
function GeometricShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Lingkaran besar — kiri atas */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
      {/* Lingkaran sedang — kanan bawah */}
      <div
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      {/* Cincin besar — tengah kanan */}
      <div
        className="absolute top-1/3 -right-16 w-64 h-64 rounded-full border-2"
        style={{ borderColor: "rgba(255,255,255,0.10)" }}
      />
      {/* Segitiga kecil melayang */}
      <div className="absolute top-28 right-1/4 floating-delayed opacity-20 select-none text-3xl text-white">▲</div>
      <div className="absolute bottom-40 left-1/4 floating opacity-15 select-none text-2xl text-white">◆</div>
      {/* Bintang */}
      <div className="absolute top-20 left-1/3 floating-slow opacity-20 select-none text-4xl text-white">✦</div>
      <div className="absolute bottom-32 right-1/3 floating-delayed opacity-15 select-none text-3xl text-white">✦</div>
      {/* Titik kecil pattern */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full floating"
          style={{
            background: "rgba(255,255,255,0.12)",
            top: `${15 + i * 14}%`,
            left: `${5 + i * 15}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

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
  const [gamePhase, setGamePhase] = useState<"welcome" | "loading" | "game" | "progres">("welcome");
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

  const handleMascotMoodChange = useCallback((mood: MascotMood, speech?: string) => {
    setMascotMood(mood);
    if (speech) setMascotSpeech(speech);
  }, []);

  const generateSoal = useCallback(async (pola: PolaTarget) => {
    sfx.playPop();
    setGamePhase("loading");
    setMascotMood("thinking");
    setMascotSpeech("Kiko sedang minta bantuan AI menyiapkan kata-kata baru...");

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
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(getApiUrl("/api/generate-soal"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pola_id: pola.id, pola_nama: pola.nama, jumlah_soal: 6 }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const soal: SoalLatihan[] = shuffleOpsi(data.soal);
      setSesi((prev) => ({ ...prev, daftar_soal: soal, loading_soal: false }));
      setFromFallback(!data.from_ai);
      setGamePhase("game");
      setMascotMood("idle");
      setMascotSpeech("Kata baru sudah siap! Tekan tombol dengarkan ya!");
    } catch {
      const fallback = pola.id === "kesalahan_fonologis" ? FALLBACK_SOAL_FONOLOGIS : FALLBACK_SOAL;
      const shuffled = shuffleOpsi([...fallback].sort(() => Math.random() - 0.5));
      setSesi((prev) => ({ ...prev, daftar_soal: shuffled, loading_soal: false, error: null }));
      setFromFallback(true);
      setGamePhase("game");
      setMascotMood("idle");
      setMascotSpeech("Kata-kata sudah siap! Ayo kita dengarkan!");
    }
  }, []);

  const generateProgres = useCallback(async (jawaban: JawabanAnak[], polaNama: string) => {
    const jumlahBenar = jawaban.filter((j) => j.benar).length;
    const totalSoal = jawaban.length;
    setSesi((prev) => ({ ...prev, loading_progres: true, kartu_progres: null }));
    setGamePhase("progres");
    setMascotMood("celebrate");
    setMascotSpeech("Hebat sekali! Kiko sedang merangkum kartu apresiasimu...");

    try {
      const res = await fetch(getApiUrl("/api/kartu-progres"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pola_target: polaNama, total_soal: totalSoal, jumlah_benar: jumlahBenar }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: KartuProgres = await res.json();
      setSesi((prev) => ({ ...prev, kartu_progres: data, loading_progres: false }));
    } catch {
      const persentase = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;
      let ringkasan: string;
      let saran: string;
      if (persentase > 90) {
        ringkasan = `Luar biasa (⭐⭐⭐)! Dari ${totalSoal} kata latihan, ${jumlahBenar} sudah tepat. Semangat terus berlatih ya! 🌟`;
        saran = "Coba latihan dengan kata-kata baru besok untuk terus memperkuat kemampuan yang sudah bagus ini.";
      } else if (persentase >= 75) {
        ringkasan = `Bagus sekali (⭐⭐)! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Beberapa kata masih butuh latihan lagi, dan itu wajar banget di tahap belajar ini. 😊`;
        saran = "Ulangi latihan ini 2-3 kali dengan kata yang berbeda, sambil ajak anak mengucapkan huruf yang mirip satu per satu.";
      } else {
        ringkasan = `Keren sudah mencoba (⭐)! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Ini baru awal latihan — semakin sering berlatih, semakin lancar! 💪`;
        saran = "Lakukan latihan singkat ini setiap hari selama 5-10 menit. Konsistensi lebih penting dari durasi yang panjang.";
      }
      setSesi((prev) => ({ ...prev, kartu_progres: { ringkasan_positif: ringkasan, saran_untuk_orang_tua: saran }, loading_progres: false }));
    }
  }, []);

  const handleJawab = useCallback(
    (jawaban: string, benar: boolean) => {
      const soalSaatIni = sesi.daftar_soal[soalAktifIdx];
      const jawabanBaru: JawabanAnak = { soal_id: soalSaatIni.id, jawaban_dipilih: jawaban, benar };
      if (benar) {
        const poin = 10 + (comboStreak >= 1 ? comboStreak * 5 : 0);
        setBintang((prev) => prev + poin);
        setComboStreak((prev) => prev + 1);
        setFloatingScore(poin);
        setTimeout(() => setFloatingScore(null), 1200);
      } else {
        setComboStreak(0);
      }
      const jawabanBaruList = [...sesi.jawaban_anak, jawabanBaru];
      const isLastSoal = soalAktifIdx >= sesi.daftar_soal.length - 1;
      setSesi((prev) => ({ ...prev, jawaban_anak: jawabanBaruList }));
      if (isLastSoal) {
        generateProgres(jawabanBaruList, sesi.pola_target.nama);
      } else {
        setSoalAktifIdx((prev) => prev + 1);
      }
    },
    [sesi, soalAktifIdx, comboStreak, generateProgres]
  );

  const handleLatihanBaru = useCallback(() => generateSoal(polaTerpilih), [generateSoal, polaTerpilih]);

  const handleGantiPola = useCallback((pola: PolaTarget) => {
    setPolaTerpilih(pola);
    sfx.playPop();
  }, []);

  useEffect(() => {
    if (gamePhase === "game" && gameRef.current) {
      setTimeout(() => gameRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [gamePhase, soalAktifIdx]);

  const soalAktif = sesi.daftar_soal[soalAktifIdx];
  const jumlahBenar = sesi.jawaban_anak.filter((j) => j.benar).length;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #0D4FBB 0%, #1B6FEF 40%, #2563EB 100%)" }}>
      <GeometricShapes />

      {/* ================================================
          HERO SECTION — Biru Bold
      ================================================ */}
      <div className="hero-bg relative">
        {/* Navbar */}
        <nav className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl sm:text-4xl">📖</span>
            <span className="text-white font-extrabold text-2xl sm:text-3xl tracking-tight" style={{ fontFamily: "var(--font-baloo)" }}>
              KataKita
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/90 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-white/20">
              Hackathon Sevima · SDG 4
            </span>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Text + CTA */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <span className="text-base">✨</span>
              <span className="text-white/95 text-xs sm:text-sm font-semibold">Didukung Google Gemini AI</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-baloo)", textShadow: "0 3px 12px rgba(0,0,0,0.2)" }}
            >
              Latihan Baca-Tulis
              <br />
              <span className="text-gradient">yang Menyenangkan!</span>
            </h1>

            <p className="text-white/85 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed mb-6 mx-auto lg:mx-0">
              Soal latihan ejaan adaptif berbasis AI yang selalu baru setiap sesi,
              cocok untuk anak SD kelas 1–3.
            </p>

            {/* Cara Main Chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
              {[
                { icon: "🎯", text: "Pilih Pola" },
                { icon: "🔊", text: "Dengarkan Kata" },
                { icon: "✅", text: "Pilih Ejaan" },
                { icon: "⭐", text: "Kumpulkan Bintang" },
              ].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1.5 text-white text-xs sm:text-sm font-semibold"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </span>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <button
                id="btn-mulai-hero"
                onClick={() => generateSoal(polaTerpilih)}
                disabled={gamePhase === "loading"}
                className="btn-primary btn-large text-lg sm:text-xl font-extrabold w-full sm:w-auto px-8 sm:px-10"
              >
                {gamePhase === "loading" ? (
                  <><span className="animate-spin text-xl">⟳</span><span>Menyiapkan Kata...</span></>
                ) : gamePhase === "welcome" ? (
                  <><span className="text-2xl">🚀</span><span>Mulai Latihan Sekarang!</span></>
                ) : (
                  <><span className="text-2xl">🔄</span><span>Latihan Baru</span></>
                )}
              </button>
            </div>
          </div>

          {/* Right: Mascot + Bar Gamifikasi */}
          <div className="flex flex-col items-center gap-5 flex-shrink-0 w-full lg:w-auto">
            <MascotCharacter
              mood={mascotMood}
              speechText={mascotSpeech}
              size="lg"
            />

            {/* Gamification Bar di dalam hero */}
            {(gamePhase === "game" || gamePhase === "progres" || bintang > 0) && (
              <div className="w-full max-w-sm">
                <GamificationBar
                  bintang={bintang}
                  comboStreak={comboStreak}
                  soalAktif={Math.min(soalAktifIdx + 1, sesi.daftar_soal.length || 6)}
                  totalSoal={sesi.daftar_soal.length || 6}
                  floatingScore={floatingScore}
                />
              </div>
            )}
          </div>
        </div>

        {/* Wave Divider ke area konten putih */}
        <div className="relative h-12 sm:h-16 overflow-hidden">
          <svg
            viewBox="0 0 1440 64"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0 w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
              fill="#EEF4FF"
            />
          </svg>
        </div>
      </div>

      {/* ================================================
          MAIN CONTENT — Fluid Responsive Layout (1 Col on Mobile, 2 Cols on Desktop)
      ================================================ */}
      <div className="main-content-bg">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ==========================================
                LEFT COLUMN (lg:col-span-5) — Info & Selector
            ========================================== */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">
              {/* Catatan Etis / Info Card */}
              <div className="card w-full flex items-start gap-3.5 sm:gap-4 border-l-4 border-blue-500 bg-white/95 shadow-sm p-4 sm:p-5">
                <span className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5 select-none" aria-hidden="true">ℹ️</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-blue-900 font-bold text-sm sm:text-base mb-1">
                    Alat bantu latihan, bukan alat diagnosis
                  </h3>
                  <p className="text-blue-900/80 text-xs sm:text-sm leading-relaxed">
                    Aplikasi ini membantu melatih pola baca-tulis yang{" "}
                    <em className="font-semibold not-italic text-blue-900">sudah diketahui atau dicurigai</em> oleh orang tua atau guru.
                    Soal AI selalu baru agar latihan tetap efektif.
                  </p>
                </div>
              </div>

              {/* PANEL PILIH POLA */}
              <div className="card w-full">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-extrabold text-blue-900 mb-1" style={{ fontFamily: "var(--font-baloo)" }}>
                    🎯 Pilih Tantangan Latihan
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">Pilih pola yang ingin kamu latih hari ini</p>
                </div>

                {/* Pola Kartu */}
                <div className="grid grid-cols-1 gap-2.5 mb-5">
                  {DAFTAR_POLA.map((pola, idx) => (
                    <button
                      key={pola.id}
                      onClick={() => {
                        if (pola.aktif) handleGantiPola(pola);
                      }}
                      disabled={!pola.aktif || gamePhase === "loading"}
                      className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        pola.aktif
                          ? polaTerpilih.id === pola.id
                            ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-400/30"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                          : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {/* Nomor badge */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          polaTerpilih.id === pola.id && pola.aktif
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-lg">{pola.emoji}</span>
                          <span className={`font-bold text-sm leading-snug ${pola.aktif ? "text-gray-800" : "text-gray-400"}`}>
                            {pola.deskripsi_singkat}
                          </span>
                        </div>
                        {!pola.aktif && (
                          <span className="text-xs text-gray-400 font-semibold">🔒 Segera hadir</span>
                        )}
                        {pola.aktif && polaTerpilih.id === pola.id && (
                          <span className="text-xs text-blue-600 font-bold">✓ Dipilih untuk latihan</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <button
                    id="btn-mulai-latihan"
                    onClick={() => generateSoal(polaTerpilih)}
                    disabled={gamePhase === "loading"}
                    className="btn-blue btn-large w-full justify-center font-extrabold text-base sm:text-lg"
                  >
                    {gamePhase === "welcome" ? (
                      <><span className="text-2xl">🚀</span><span>Mulai Latihan!</span></>
                    ) : gamePhase === "loading" ? (
                      <><span className="animate-spin text-xl">⟳</span><span>Menyiapkan kata...</span></>
                    ) : (
                      <><span className="text-2xl">🔄</span><span>Latihan Baru</span></>
                    )}
                  </button>

                  {gamePhase !== "welcome" && gamePhase !== "loading" && (
                    <button
                      id="btn-lihat-progres"
                      onClick={() => {
                        if (sesi.jawaban_anak.length >= 3) {
                          generateProgres(sesi.jawaban_anak, sesi.pola_target.nama);
                        } else {
                          alert(`Selesaikan minimal 3 kata dulu ya! Baru ${sesi.jawaban_anak.length} kata selesai.`);
                        }
                      }}
                      disabled={sesi.jawaban_anak.length < 3 || gamePhase === "progres"}
                      className="btn-primary btn-large w-full justify-center font-extrabold text-base sm:text-lg"
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
                    <span>Menggunakan bank kata cadangan (offline). Kata tetap variatif dan efektif.</span>
                  </div>
                )}
              </div>
            </div>

            {/* ==========================================
                RIGHT COLUMN (lg:col-span-7) — Game & Guide Area
            ========================================== */}
            <div className="lg:col-span-7 space-y-5">
              {/* AREA GAME */}
              {gamePhase !== "welcome" && (
                <div ref={gameRef} className="w-full">
                  {gamePhase === "loading" && (
                    <LoadingSpinner message="AI Gemini sedang merancang kata-kata baru..." />
                  )}

                  {gamePhase === "game" && soalAktif && (
                    <div className="animate-scale-in">
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
              )}

              {/* WELCOME SCREEN / CARA BERMAIN */}
              {gamePhase === "welcome" && (
                <div ref={gameRef} className="card animate-fade-in w-full">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-extrabold text-blue-900 mb-2" style={{ fontFamily: "var(--font-baloo)" }}>
                      🎮 Cara Bermain Bersama Kiko
                    </h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Latihan baca dan tulis dirancang interaktif untuk membantu mengingat pola ejaan dengan mudah!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                    {[
                      { icon: "🎯", title: "1. Pilih Pola", desc: "Pilih tantangan ejaan yang ingin dilatih di panel samping" },
                      { icon: "🔊", title: "2. Dengarkan", desc: "Klik tombol suara untuk mendengar pengucapan yang jelas" },
                      { icon: "⭐", title: "3. Kumpulkan Bintang", desc: "Pilih ejaan yang tepat dan kumpulkan bintang prestasimu!" },
                    ].map((step, i) => (
                      <div key={i} className="text-center p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col items-center justify-start hover:bg-blue-50 transition-colors">
                        <div className="text-3xl sm:text-4xl mb-2.5">{step.icon}</div>
                        <div className="font-bold text-blue-900 text-sm sm:text-base mb-1">{step.title}</div>
                        <div className="text-xs sm:text-sm text-gray-500 leading-normal">{step.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <span className="text-3xl">💡</span>
                      <div>
                        <div className="font-bold text-base">Siap Mencoba Kata Pertama?</div>
                        <div className="text-xs text-white/80">Setiap sesi terdiri dari 6 kata yang dirancang oleh AI</div>
                      </div>
                    </div>
                    <button
                      onClick={() => generateSoal(polaTerpilih)}
                      className="btn-primary px-6 py-2.5 text-base font-bold whitespace-nowrap w-full sm:w-auto"
                    >
                      Mulai Sekarang ➔
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <footer className="text-center text-xs text-blue-400 mt-12 space-y-1">
            <p>🌟 Dibuat untuk mendukung SDG 4 — Pendidikan Berkualitas</p>
            <p>Platform Latihan Membaca & Mengeja Adaptif Berbasis AI · Hackathon Sevima 2026</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
