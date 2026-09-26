import { SoalLatihan, KartuProgres } from "@/types";

// ============================================================
// AI API Utilities (Gemini)
// ============================================================

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";

interface GeminiCandidate {
  content: {
    parts: { text: string }[];
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY tidak dikonfigurasi");
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

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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
    throw new Error("Respons kosong dari AI");
  }
  return text;
}

function extractJSON(text: string): string {
  // Coba extract JSON dari code block markdown
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Coba cari JSON object langsung
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];

  return text.trim();
}

// ============================================================
// Generator Soal Latihan
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

interface GeneratorResponse {
  soal: {
    kata_target: string;
    audio_text: string;
    opsi_jawaban: string[];
    jawaban_benar: string;
  }[];
}

export async function generateSoal(
  polaId: string,
  polaNama: string,
  jumlahSoal: number = 6
): Promise<SoalLatihan[]> {
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

  return parsed.soal.map((s, idx) => ({
    id: `ai_${Date.now()}_${idx}`,
    kata_target: s.kata_target,
    audio_text: s.audio_text || s.kata_target,
    opsi_jawaban: s.opsi_jawaban,
    jawaban_benar: s.jawaban_benar,
  }));
}

// ============================================================
// Generator Kartu Progres
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

interface ProgresResponse {
  ringkasan_positif: string;
  saran_untuk_orang_tua: string;
}

export async function generateKartuProgres(
  polaTarget: string,
  totalSoal: number,
  jumlahBenar: number
): Promise<KartuProgres> {
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
  };
}
