import { PolaTarget, SoalLatihan } from "../types";

// ============================================================
// Daftar Pola Target
// ============================================================

export const DAFTAR_POLA: PolaTarget[] = [
  {
    id: "pembalikan_huruf_mirip",
    nama: "Sering tertukar huruf mirip bentuk (b/d, p/q, m/w, n/u)",
    deskripsi_singkat: "Latihan membedakan huruf yang bentuknya mirip secara visual",
    emoji: "🔤",
    aktif: true,
  },
  {
    id: "kesalahan_fonologis",
    nama: "Menulis kata sesuai bunyi sehari-hari, bukan ejaan baku",
    deskripsi_singkat: "Latihan ejaan baku vs pengucapan sehari-hari",
    emoji: "🗣️",
    aktif: true,
  },
  {
    id: "pembalikan_urutan_huruf",
    nama: "Sering terbalik urutan huruf dalam kata",
    deskripsi_singkat: "Latihan urutan dan posisi huruf dalam kata",
    emoji: "🔀",
    aktif: false,
  },
  {
    id: "penghilangan_penambahan_huruf",
    nama: "Sering ada huruf yang hilang atau berlebih",
    deskripsi_singkat: "Latihan kelengkapan huruf dalam kata",
    emoji: "✏️",
    aktif: false,
  },
  {
    id: "tanpa_pola_tertentu",
    nama: "Belum ada pola spesifik, latihan umum saja",
    deskripsi_singkat: "Latihan kosakata umum untuk anak SD kelas 1-3",
    emoji: "📚",
    aktif: false,
  },
];

export const POLA_DEFAULT = DAFTAR_POLA[0];

// ============================================================
// Fallback soal statis (cadangan kalau API gagal)
// ============================================================

export const FALLBACK_SOAL: SoalLatihan[] = [
  {
    id: "f1",
    kata_target: "buku",
    audio_text: "buku",
    opsi_jawaban: ["buku", "duku", "puku"],
    jawaban_benar: "buku",
  },
  {
    id: "f2",
    kata_target: "bola",
    audio_text: "bola",
    opsi_jawaban: ["bola", "dola", "wola"],
    jawaban_benar: "bola",
  },
  {
    id: "f3",
    kata_target: "domba",
    audio_text: "domba",
    opsi_jawaban: ["domba", "bomba", "bomda"],
    jawaban_benar: "domba",
  },
  {
    id: "f4",
    kata_target: "payung",
    audio_text: "payung",
    opsi_jawaban: ["payung", "qayung", "payunq"],
    jawaban_benar: "payung",
  },
  {
    id: "f5",
    kata_target: "meja",
    audio_text: "meja",
    opsi_jawaban: ["meja", "weja", "neja"],
    jawaban_benar: "meja",
  },
  {
    id: "f6",
    kata_target: "sepatu",
    audio_text: "sepatu",
    opsi_jawaban: ["sepatu", "zepatu", "sepadu"],
    jawaban_benar: "sepatu",
  },
  {
    id: "f7",
    kata_target: "bebek",
    audio_text: "bebek",
    opsi_jawaban: ["bebek", "dedek", "pedek"],
    jawaban_benar: "bebek",
  },
  {
    id: "f8",
    kata_target: "pisang",
    audio_text: "pisang",
    opsi_jawaban: ["pisang", "qisang", "bisang"],
    jawaban_benar: "pisang",
  },
];

export const FALLBACK_SOAL_FONOLOGIS: SoalLatihan[] = [
  {
    id: "ff1",
    kata_target: "kalau",
    audio_text: "kalau",
    opsi_jawaban: ["kalau", "kalo", "kalu"],
    jawaban_benar: "kalau",
  },
  {
    id: "ff2",
    kata_target: "sudah",
    audio_text: "sudah",
    opsi_jawaban: ["sudah", "udah", "sudeh"],
    jawaban_benar: "sudah",
  },
  {
    id: "ff3",
    kata_target: "begitu",
    audio_text: "begitu",
    opsi_jawaban: ["begitu", "gitu", "begeto"],
    jawaban_benar: "begitu",
  },
  {
    id: "ff4",
    kata_target: "memang",
    audio_text: "memang",
    opsi_jawaban: ["memang", "emang", "memeng"],
    jawaban_benar: "memang",
  },
  {
    id: "ff5",
    kata_target: "dengan",
    audio_text: "dengan",
    opsi_jawaban: ["dengan", "dengen", "dengn"],
    jawaban_benar: "dengan",
  },
  {
    id: "ff6",
    kata_target: "pakai",
    audio_text: "pakai",
    opsi_jawaban: ["pakai", "pake", "pakey"],
    jawaban_benar: "pakai",
  },
  {
    id: "ff7",
    kata_target: "cabai",
    audio_text: "cabai",
    opsi_jawaban: ["cabai", "cabe", "cabay"],
    jawaban_benar: "cabai",
  },
  {
    id: "ff8",
    kata_target: "karena",
    audio_text: "karena",
    opsi_jawaban: ["karena", "karna", "karana"],
    jawaban_benar: "karena",
  },
  {
    id: "ff9",
    kata_target: "lubang",
    audio_text: "lubang",
    opsi_jawaban: ["lubang", "lobang", "luban"],
    jawaban_benar: "lubang",
  },
  {
    id: "ff10",
    kata_target: "ramai",
    audio_text: "ramai",
    opsi_jawaban: ["ramai", "rame", "ramay"],
    jawaban_benar: "ramai",
  },
];
