# KataKita — Generator Latihan Personal Pola Baca-Tulis

> Solusi personalisasi latihan baca-tulis berbasis AI untuk mendukung **SDG 4 (Pendidikan Berkualitas)** pada ajang Hackathon SEVIMA.

## 📖 Tentang Aplikasi
**KataKita** adalah aplikasi interaktif ramah anak yang dirancang untuk membantu anak-anak usia 6–9 tahun (SD kelas 1–3) yang mengalami kesulitan pada pola baca-tulis tertentu (seperti tertukar huruf mirip `b/d`, `p/q`, atau kesalahan fonologis). 

Aplikasi ini menggunakan **Generative AI (Google Gemini)** untuk menghasilkan variasi soal baru tanpa henti yang selalu tepat sasaran, dilengkapi audio pengucapan (TTS) dan kartu progres apresiatif tanpa pelabelan negatif.

## 🚀 Fitur Utama
- **Generasi Soal Adaptif AI**: Menghasilkan kata-kata baru secara dinamis sesuai pola kesulitan yang dipilih.
- **Audio Text-to-Speech (TTS)**: Pengucapan kata berbahasa Indonesia yang jelas untuk melatih persepsi auditori anak.
- **Kartu Progres Hangat**: Rangkuman progres berbasis penguatan positif dan saran tindak lanjut yang ramah untuk orang tua/guru.
- **Offline Fallback Engine**: Sistem tetap dapat berjalan lancar menggunakan dataset cerdas meskipun koneksi AI terganggu.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Canvas-Confetti, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, CORS, Dotenv
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`)

## 📦 Menjalankan Secara Lokal
```bash
# 1. Clone repository
git clone https://github.com/TediiSyah/sevima-katakita.git
cd sevima-katakita

# 2. Setup file environment (.env.local dan backend/.env)
# Masukkan GEMINI_API_KEY Anda

# 3. Jalankan kedua service secara bersamaan
npm run dev
```
- Frontend berjalan di: `http://localhost:3000` (atau `3001`)
- Backend API berjalan di: `http://localhost:5000`
