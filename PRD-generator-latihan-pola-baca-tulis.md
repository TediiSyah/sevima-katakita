# Product Requirement Document
## Generator Latihan Personal untuk Pola Kesulitan Baca-Tulis Anak

---

## 1. Ringkasan Produk

Aplikasi web yang membantu orang tua/guru **melatih** anak yang **sudah diketahui atau dicurigai** memiliki pola kesulitan baca-tulis spesifik (misalnya sering tertukar huruf b/d), dengan menghasilkan latihan baru secara terus-menerus lewat AI — bukan bank soal statis yang cepat dihafal anak — dikemas dalam bentuk game sederhana dan menyenangkan untuk anak SD kelas 1-3. Dibangun untuk demo hackathon SDG 4 (Pendidikan Berkualitas), skenario 3-5 menit.

**Ini BUKAN alat diagnosis.** Aplikasi ini berangkat dari premis bahwa pola kesulitan anak sudah diketahui/dicurigai lebih dulu oleh orang tua, guru, atau psikolog — tugas aplikasi murni membantu proses latihannya.

---

## 2. Latar Belakang Masalah

**Evidence (dengan catatan kejujuran data):**
- Tidak ada data resmi pemerintah Indonesia mengenai jumlah pasti anak dengan disleksia/kesulitan belajar spesifik; angka-angka yang beredar di media (termasuk angka "jutaan anak") berasal dari pernyataan asosiasi non-pemerintah, bukan riset resmi. **Produk ini tidak menjadikan angka prevalensi sebagai klaim utama.**
- Yang lebih dapat diverifikasi: kesadaran dan ketersediaan alat bantu pembelajaran yang ramah untuk anak dengan kesulitan baca-tulis spesifik di Indonesia masih terbatas, dan sebagian besar aplikasi bantu-baca yang tersedia dibuat untuk Bahasa Inggris (mis. Nessy, Reading Eggs).
- Bahasa Indonesia memiliki ejaan yang jauh lebih fonetis/transparan dibanding Bahasa Inggris, sehingga pola kesalahan anak Indonesia (mis. b/d di "buku"/"duku") secara karakter berbeda dari pola yang dilatih di aplikasi impor tersebut — materi latihan impor tidak benar-benar relevan.

**Interpretasi:** Ada celah nyata antara kebutuhan (anak Indonesia yang butuh latihan bertarget) dan ketersediaan alat (materi lokal yang presisi ke pola tertentu, bukan generik).

**Masalah inti yang dijawab produk ini:** orang tua/guru yang sudah tahu anaknya kesulitan di pola tertentu tidak punya cara mudah dan murah untuk memberi anak latihan yang **terus bervariasi dan tepat sasaran** ke pola itu spesifik, dalam Bahasa Indonesia.

---

## 3. Unique Selling Point (USP)

> Bukan bank soal generik untuk "anak berkesulitan belajar" secara umum — tapi generator latihan tak terbatas yang dikalibrasi presisi ke SATU pola kesalahan spesifik anak tertentu, dalam Bahasa Indonesia asli (bukan terjemahan).

Tiga pembeda:
1. **Presisi per-pola**, bukan kurikulum baca umum — sistem hanya melatih pola yang dipilih orang tua/guru, berulang dengan variasi.
2. **Bahasa Indonesia asli**, dikonstruksi dari karakter ejaan fonetis Bahasa Indonesia, bukan adaptasi dari materi Bahasa Inggris.
3. **AI menjamin variasi tanpa batas** — tanpa AI, materi akan cepat dihafal anak dalam 2-3 sesi dan latihan jadi tidak efektif; AI di sini punya fungsi struktural, bukan sekadar kemudahan.

---

## 4. Tujuan Produk

### Goals (MVP)
- G1: Orang tua/guru dapat memilih satu pola kesulitan target dari daftar (dropdown), tanpa perlu aplikasi mendiagnosis apa pun.
- G2: Sistem menghasilkan set latihan baru (kata/kalimat) yang secara sengaja mengandung tantangan pola tersebut, berbeda setiap sesi.
- G3: Latihan dikemas sebagai game sederhana dan menyenangkan (bukan form/tes), dengan opsi dibacakan (text-to-speech).
- G4: Setelah beberapa ronde, tampilkan kartu progres yang positif dan memotivasi, bukan skor yang menghakimi.
- G5: Aplikasi secara eksplisit tidak pernah mengklaim mendiagnosis atau menyimpulkan kondisi medis apa pun.

### Non-Goals (di luar cakupan MVP)
- Bukan alat diagnosis/skrining kondisi apa pun — pola kesulitan adalah INPUT dari pengguna, bukan OUTPUT dari sistem.
- Tidak menangani semua 5 pola sekaligus di versi demo (fokus 1 pola: pembalikan huruf mirip b/d), meski struktur data mendukung penambahan pola lain.
- Tidak ada speech-to-text/pengenalan suara anak di MVP (terlalu berisiko teknis untuk 6 jam); text-to-speech (AI membacakan) saja yang termasuk.
- Tidak ada login, manajemen banyak anak, atau database permanen.

---

## 5. Target Pengguna

- **Pengguna utama (yang mengoperasikan):** orang tua atau guru SD kelas 1-3 yang sudah menduga/mengetahui anak mereka kesulitan di pola baca-tulis tertentu.
- **Penerima manfaat langsung:** anak usia 6-9 tahun yang berlatih lewat game di aplikasi ini, didampingi orang dewasa.

---

## 6. Ruang Lingkup

### Termasuk (MVP, dibangun dalam 6 jam)
- Pemilihan pola target dari dropdown (5 pola tersedia, tapi demo fokus ke 1: pembalikan huruf mirip).
- Generator latihan otomatis lewat AI, menghasilkan 5-8 kata/kalimat baru per sesi yang mengandung tantangan pola tersebut.
- Game sederhana bertipe pilihan (anak memilih huruf/kata yang benar dari 2-3 opsi), dengan feedback visual langsung (benar/coba lagi, tanpa nada menghakimi).
- Tombol "Dengarkan" di tiap soal (text-to-speech browser, tanpa API tambahan).
- Kartu progres setelah minimal 5 soal dijawab, dihasilkan AI, bernada positif dan memotivasi.
- Tombol "Latihan Baru" untuk sesi baru dengan variasi kata berbeda.

### Tidak Termasuk (di luar MVP)
- Diagnosis/skrining pola dari kesalahan anak (ini fitur versi SEBELUM pivot, sengaja tidak dipakai lagi).
- Pengenalan suara (speech-to-text) untuk menilai bacaan anak.
- Login/akun, banyak profil anak, riwayat lintas sesi (database).
- Dukungan 5 pola sekaligus secara penuh di demo (cukup 1 pola dengan sempurna).

---

## 7. Alur Pengguna (User Flow)

1. Orang tua/guru membuka aplikasi, melihat halaman utama dengan penjelasan singkat dan catatan bahwa aplikasi ini alat bantu latihan (bukan diagnosis).
2. Orang tua/guru memilih pola target dari dropdown (mis. "Sering tertukar huruf b dan d").
3. Sistem memanggil AI untuk menghasilkan 5-8 soal latihan baru yang mengandung tantangan pola tersebut.
4. Anak (didampingi orang dewasa) memainkan game: tiap soal muncul sebagai kartu dengan gambar/kata, ada tombol "Dengarkan", lalu anak memilih jawaban dari 2-3 opsi.
5. Setiap jawaban diberi feedback instan dan menyenangkan (animasi, tanpa warna alarm).
6. Setelah 5+ soal selesai, tombol "Lihat Kartu Progres" aktif, memanggil AI untuk merangkum sesi secara positif dan memberi saran singkat untuk orang tua.
7. Orang tua/guru bisa menekan "Latihan Baru" untuk sesi berikutnya dengan soal yang berbeda.

---

## 8. Fitur & Requirement Fungsional

| ID | Fitur | Prioritas | Deskripsi |
|----|-------|-----------|-----------|
| F1 | Pilih pola target | Must | Dropdown 5 pola, default terpilih untuk demo: pembalikan huruf mirip |
| F2 | Generator latihan AI | Must | Panggil AI untuk hasilkan 5-8 soal baru per sesi, sesuai pola target |
| F3 | Game pilihan jawaban | Must | Tampilan kartu soal + 2-3 opsi jawaban + feedback instan |
| F4 | Text-to-speech | Must | Tombol "Dengarkan" memakai Web Speech API browser (gratis, tanpa API key) |
| F5 | Kartu progres positif | Must | Setelah 5+ soal, panggil AI untuk rangkuman bernada positif + saran singkat |
| F6 | Sesi latihan baru | Must | Reset soal dengan variasi baru dari AI, tanpa reset pola target |
| F7 | Animasi & feedback visual fun | Should | Transisi/animasi ringan saat jawab benar/salah |
| F8 | Dukungan pola lain (selain b/d) | Could | Kalau waktu cukup, aktifkan 1-2 pola tambahan di dropdown |

---

## 9. Struktur Data

```
PolaTarget {
  id: string            // "pembalikan_huruf_mirip" | "pembalikan_urutan_huruf" | dst
  nama: string           // label ramah untuk ditampilkan
  deskripsi_singkat: string
}

SoalLatihan {
  id: string
  kata_atau_kalimat: string   // dengan bagian yang perlu dilengkapi/pilih
  opsi_jawaban: string[]      // 2-3 opsi
  jawaban_benar: string
  audio_text: string          // teks yang dibacakan text-to-speech
}

SesiLatihan {
  pola_target: PolaTarget
  daftar_soal: SoalLatihan[]
  jawaban_anak: { soal_id: string, jawaban_dipilih: string, benar: boolean }[]
  kartu_progres: {
    ringkasan_positif: string
    saran_untuk_orang_tua: string
  } | null
}
```

---

## 10. Kebutuhan Non-Fungsional

- **Etis:** aplikasi tidak pernah menyimpulkan atau menyebut kondisi medis apa pun; bahasa yang dipakai selalu "latihan untuk pola yang sudah diketahui", bukan "deteksi" atau "diagnosis". Tetap ada catatan singkat dan ramah di halaman utama yang menegaskan ini alat bantu latihan, bukan alat diagnosis.
- **Nada bahasa:** semua teks (UI dan output AI) positif dan memotivasi, hindari kata-kata seperti "gagal", "salah lagi", "masih belum bisa" — ganti dengan "coba sekali lagi, yuk!" dsb.
- **Bahasa:** seluruh UI dan output AI dalam Bahasa Indonesia.
- **Performa demo:** generasi soal baru harus tampil dalam hitungan detik; sediakan fallback soal statis (dari dataset lama yang sudah ada) kalau panggilan AI lambat/gagal saat demo.
- **Konsistensi AI:** prompt harus memaksa output JSON ketat agar parsing di frontend tidak gagal.

---

## 11. Skenario Demo untuk Juri (3-5 menit)

1. **15 detik narasi pembuka:** perkenalkan orang tua fiktif yang sudah tahu anaknya, "Rafi", sering tertukar huruf b dan d saat menulis, dan sudah disarankan psikolog sekolah untuk latihan rutin di rumah — tapi bingung mau kasih latihan apa yang tidak itu-itu saja.
2. **2-3 menit demo teknis:** pilih pola "tertukar b/d" → tunjukkan AI menghasilkan set soal baru → mainkan 2-3 soal sebagai anak (klik jawaban, dengar audio, lihat feedback fun) → tekan "Latihan Baru" untuk tunjukkan soal yang dihasilkan BERBEDA dari sebelumnya (bukti tidak hafal) → tampilkan kartu progres.
3. **15 detik penutup:** tegaskan bahwa Rafi bisa berlatih setiap hari dengan soal yang selalu baru, tanpa orang tua harus membuat soal sendiri atau khawatir anaknya menghafal jawaban.

---

## 12. Rencana Pengembangan Lanjutan (Di Luar MVP)

- Pengenalan suara (speech-to-text) untuk menilai langsung bacaan anak, bukan hanya pilihan ganda.
- Dukungan penuh 5 pola sekaligus, dengan kemungkinan gabungan pola per anak.
- Riwayat progres lintas sesi (dengan database) agar orang tua bisa lihat perkembangan dari waktu ke waktu.
- Mode kolaborasi guru-orang tua (guru menetapkan pola target, orang tua menjalankan latihan di rumah).

---

## 13. Batasan dan Risiko

- Aplikasi ini murni alat bantu latihan; identifikasi pola kesulitan anak tetap sepenuhnya tanggung jawab orang tua/guru/psikolog, bukan aplikasi ini.
- Soal yang dihasilkan AI perlu difilter agar memakai kosakata yang wajar untuk anak SD kelas 1-3 (hindari kata asing/sulit); prompt harus eksplisit membatasi ini.
- Kalau panggilan AI gagal saat demo, harus ada fallback set soal statis supaya demo tidak terhenti.

---

## 14. Tech Stack

- Frontend: React + Next.js + TypeScript + Tailwind CSS
- Text-to-speech: Web Speech API bawaan browser (tidak perlu API key tambahan)
- AI: Panggilan API model bahasa untuk generator soal dan kartu progres (lihat `master-prompt-antigravity-pivot.md`)
- Deployment: Vercel atau sejenis untuk akses cepat lewat link saat presentasi
