// ============================================================
// Tipe Data untuk Aplikasi Generator Latihan Baca-Tulis
// ============================================================

export interface PolaTarget {
  id: string;
  nama: string;
  deskripsi_singkat: string;
  emoji: string;
  aktif: boolean; // false = tampil di dropdown tapi disabled
}

export interface SoalLatihan {
  id: string;
  kata_target: string;
  audio_text: string;
  opsi_jawaban: string[];
  jawaban_benar: string;
}

export interface JawabanAnak {
  soal_id: string;
  jawaban_dipilih: string;
  benar: boolean;
}

export interface KartuProgres {
  ringkasan_positif: string;
  saran_untuk_orang_tua: string;
}

export interface SesiLatihan {
  pola_target: PolaTarget;
  daftar_soal: SoalLatihan[];
  jawaban_anak: JawabanAnak[];
  kartu_progres: KartuProgres | null;
  loading_soal: boolean;
  loading_progres: boolean;
  error: string | null;
}

export type FeedbackStatus = "idle" | "benar" | "coba_lagi";
