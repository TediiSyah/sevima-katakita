import { config } from "../config/env";
import { SoalLatihan, KartuProgres } from "../types";
import { FALLBACK_SOAL, FALLBACK_SOAL_FONOLOGIS } from "../data/pola";

interface GeminiCandidate {
  content: {
    parts: { text: string }[];
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

interface GeneratorResponse {
  soal: {
    kata_target: string;
    audio_text: string;
    opsi_jawaban: string[];
    jawaban_benar: string;
  }[];
}

interface ProgresResponse {
  ringkasan_positif: string;
  saran_untuk_orang_tua: string;
}

// Helper untuk extract JSON dari respons AI
function extractJSON(text: string): string {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];

  return text.trim();
}

// Pemanggilan ke Gemini AI dengan retry backoff
async function callGemini(
  systemPrompt: string,
  userMessage: string,
  retries: number = 2
): Promise<string> {
  const apiKey = config.geminiApiKey;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY tidak dikonfigurasi di environment");
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}\n\n---\n\nUser message:\n${userMessage}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${config.geminiApiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error ${response.status}: ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Respons teks kosong dari Gemini AI");
      }
      return text;
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries) {
        // Tunggu 1 detik sebelum mencoba lagi (exponential backoff sederhana)
        await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

// ============================================================
// Service: Generate Soal Latihan
// ============================================================

const SYSTEM_PROMPT_GENERATOR = `Kamu adalah generator soal latihan baca-tulis untuk anak SD kelas 1-3
berbahasa Indonesia. Tugasmu membuat soal latihan yang secara SENGAJA
menargetkan satu pola kesulitan tertentu, supaya anak berlatih tepat sasaran.

Definisi pola (gunakan salah satu sesuai pola_id):
- pembalikan_huruf_mirip: kata harus mengandung huruf yang bentuknya mirip
  secara visual (b/d, p/q, m/w, n/u, s/z), sehingga anak perlu membedakannya.
- pembalikan_urutan_huruf: kata harus punya potensi tertukar urutan/posisi
  huruf atau suku katanya.
- kesalahan_fonologis: kata harus punya perbedaan antara ejaan baku dan cara
  pengucapan sehari-hari (misalnya "kalau" vs "kalo").
- penghilangan_penambahan_huruf: kata harus punya gugus konsonan atau huruf
  di posisi yang mudah terlewat/tertambah (misalnya akhiran -ng, -h).
- tanpa_pola_tertentu: kata bervariasi bebas, tidak perlu menargetkan pola
  spesifik, fokus ke kosakata umum SD kelas 1-3.

ATURAN PENTING:
- Buat soal sejumlah yang diminta. WAJIB semuanya soal BARU dan berbeda dari
  kumpulan kata umum yang sering dipakai sebagai contoh (buku/duku,
  bola/dola, dsb) — kalau kamu dipanggil berkali-kali untuk pola yang sama,
  setiap kali harus menghasilkan kata yang berbeda dari panggilan sebelumnya.
- Gunakan HANYA kosakata umum dan wajar untuk anak usia 6-9 tahun (benda,
  hewan, aktivitas sehari-hari), hindari kata asing, sulit, atau abstrak.
- Setiap soal adalah kata tunggal (bukan kalimat panjang) dengan 3 pilihan
  jawaban: 1 jawaban benar (ejaan yang tepat) dan 2 pengecoh yang relevan
  dengan pola target (bukan pengecoh acak yang tidak ada hubungannya).
- Nada bahasa di seluruh output harus netral-positif, tidak ada kata yang
  terkesan menilai/menghakimi.
- PENTING: Pastikan opsi_jawaban berisi tepat 3 elemen yang berbeda satu sama lain.
- PENTING: jawaban_benar harus sama persis (termasuk huruf besar/kecil) dengan salah satu elemen di opsi_jawaban.

Jawab HANYA dalam format JSON berikut, tanpa teks tambahan apa pun:
{
  "soal": [
    {
      "kata_target": "<kata yang benar>",
      "audio_text": "<teks yang akan dibacakan text-to-speech, biasanya sama dengan kata_target>",
      "opsi_jawaban": ["<opsi 1>", "<opsi 2>", "<opsi 3>"],
      "jawaban_benar": "<harus sama persis dengan salah satu opsi_jawaban>"
    }
  ]
}`;

export async function generateSoalService(
  polaId: string,
  polaNama: string,
  jumlahSoal: number = 6
): Promise<{ soal: SoalLatihan[]; from_ai: boolean; fallback_reason?: string }> {
  try {
    const userMessage = `pola_id: ${polaId}
pola_nama: ${polaNama}
jumlah_soal: ${jumlahSoal}
Waktu pembuatan: ${new Date().toISOString()} (gunakan ini untuk memastikan variasi kata yang benar-benar berbeda dari sesi sebelumnya)`;

    const rawText = await callGemini(SYSTEM_PROMPT_GENERATOR, userMessage);
    const jsonStr = extractJSON(rawText);
    const parsed: GeneratorResponse = JSON.parse(jsonStr);

    if (!parsed.soal || !Array.isArray(parsed.soal)) {
      throw new Error("Format respons AI tidak valid");
    }

    const soal = parsed.soal.map((s, idx) => ({
      id: `ai_${Date.now()}_${idx}`,
      kata_target: s.kata_target,
      audio_text: s.audio_text || s.kata_target,
      opsi_jawaban: s.opsi_jawaban,
      jawaban_benar: s.jawaban_benar,
    }));

    return { soal, from_ai: true };
  } catch (error) {
    console.warn("Gemini AI gagal menghasilkan soal, menggunakan fallback cerdas:", error);

    let fallback = FALLBACK_SOAL;
    if (polaId === "kesalahan_fonologis") {
      fallback = FALLBACK_SOAL_FONOLOGIS;
    }

    // Shuffle fallback agar tiap sesi tetap terasa fresh
    const shuffled = [...fallback].sort(() => Math.random() - 0.5);

    return {
      soal: shuffled.slice(0, jumlahSoal),
      from_ai: false,
      fallback_reason: (error as Error).message,
    };
  }
}

// ============================================================
// Service: Generate Kartu Progres
// ============================================================

const SYSTEM_PROMPT_PROGRES = `Kamu membuat rangkuman progres latihan baca-tulis anak untuk ditampilkan ke
orang tua/guru, dengan nada HANGAT dan MEMOTIVASI. Ini BUKAN rapor atau nilai
ujian — ini kartu progres latihan biasa yang tujuannya menyemangati anak
untuk terus berlatih.

ATURAN PENTING:
- JANGAN PERNAH menyebut kondisi medis apa pun (disleksia, dsb).
- JANGAN PERNAH memakai kata "gagal", "salah total", "kurang", atau nada
  yang terkesan menilai buruk. Kalaupun hasilnya rendah, bingkai sebagai
  "baru mulai berlatih" atau "butuh beberapa kali lagi", bukan kegagalan.
- Selalu akhiri dengan ajakan positif untuk sesi berikutnya.
- Gunakan bahasa yang mudah dipahami orang tua non-spesialis.

Jawab dalam format JSON berikut:
{
  "ringkasan_positif": "<2-3 kalimat, hangat, jujur tapi tidak menghakimi>",
  "saran_untuk_orang_tua": "<1-2 kalimat saran konkret dan actionable>"
}`;

export async function generateKartuProgresService(
  polaTarget: string,
  totalSoal: number,
  jumlahBenar: number
): Promise<{
  ringkasan_positif: string;
  saran_untuk_orang_tua: string;
  from_ai: boolean;
  fallback_reason?: string;
}> {
  try {
    const userMessage = `pola_target: ${polaTarget}
total_soal: ${totalSoal}
jumlah_benar: ${jumlahBenar}`;

    const rawText = await callGemini(SYSTEM_PROMPT_PROGRES, userMessage);
    const jsonStr = extractJSON(rawText);
    const parsed: ProgresResponse = JSON.parse(jsonStr);

    if (!parsed.ringkasan_positif || !parsed.saran_untuk_orang_tua) {
      throw new Error("Format respons kartu progres tidak valid");
    }

    return {
      ringkasan_positif: parsed.ringkasan_positif,
      saran_untuk_orang_tua: parsed.saran_untuk_orang_tua,
      from_ai: true,
    };
  } catch (error) {
    console.warn("Gemini AI gagal menghasilkan progres, menggunakan fallback cerdas:", error);

    const persentase = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;
    let ringkasan: string;
    let saran: string;

    if (persentase > 90) {
      ringkasan = `Luar biasa (⭐⭐⭐)! Dari ${totalSoal} kata latihan, ${jumlahBenar} sudah tepat. Terus semangat berlatih ya! 🌟`;
      saran =
        "Coba latihan dengan kata-kata baru besok untuk memperkuat kemampuan yang sudah bagus ini.";
    } else if (persentase >= 75) {
      ringkasan = `Bagus sekali (⭐⭐)! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Beberapa kata masih butuh latihan lagi, dan itu wajar banget di tahap belajar ini. 😊`;
      saran =
        "Ulangi latihan ini 2-3 kali dengan kata yang berbeda, sambil ajak anak mengucapkan huruf yang mirip satu per satu.";
    } else {
      ringkasan = `Keren sudah mencoba (⭐)! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Ini baru awal latihan — semakin sering berlatih, semakin lancar! 💪`;
      saran =
        "Lakukan latihan singkat ini setiap hari selama 5-10 menit. Konsistensi lebih penting dari durasi panjang.";
    }

    return {
      ringkasan_positif: ringkasan,
      saran_untuk_orang_tua: saran,
      from_ai: false,
      fallback_reason: (error as Error).message,
    };
  }
}
