# Master Prompt: Bangun Aplikasi "Generator Latihan Personal Pola Baca-Tulis"

> Salin seluruh isi di bawah ini (mulai dari "## KONTEKS PROYEK") sebagai satu
> prompt ke AI coding agent (Antigravity atau sejenis). Lampirkan juga file
> `PRD-generator-latihan-pola-baca-tulis.md` kalau agent-nya mendukung upload
> file, supaya konteksnya lengkap.

---

## KONTEKS PROYEK

Kamu adalah AI developer yang akan membangun aplikasi web untuk demo hackathon
SDG 4 (Pendidikan Berkualitas), waktu pengerjaan sangat terbatas (target
selesai dalam hitungan jam). Prioritaskan MVP yang benar-benar berjalan dan
stabil saat didemokan langsung, daripada fitur banyak tapi rapuh.

**Nama produk**: Generator Latihan Personal Pola Baca-Tulis

**Masalah yang dipecahkan**: Orang tua/guru yang sudah tahu seorang anak
kesulitan di pola baca-tulis tertentu (misalnya sering tertukar huruf b dan
d) kesulitan memberi latihan yang terus bervariasi dan tepat sasaran ke pola
itu. Bank soal statis cepat dihafal anak dalam beberapa sesi sehingga latihan
jadi tidak efektif, dan sebagian besar aplikasi bantu-baca yang ada dibuat
untuk Bahasa Inggris, bukan pola ejaan Bahasa Indonesia.

**INI PENTING — perbedaan dengan versi sebelumnya**: Aplikasi ini **BUKAN**
alat deteksi/diagnosis. Pola kesulitan anak adalah **INPUT** yang dipilih
sendiri oleh orang tua/guru (mereka sudah tahu atau menduga polanya dari
pengamatan sehari-hari atau saran psikolog), bukan sesuatu yang disimpulkan
oleh AI dari kesalahan anak. Tugas aplikasi murni menghasilkan LATIHAN untuk
pola yang sudah dipilih itu.

**UNIQUE SELLING POINT yang harus terasa di produk jadi**:
1. Latihan presisi ke SATU pola spesifik, bukan kurikulum baca umum.
2. Materi asli Bahasa Indonesia (bukan adaptasi Bahasa Inggris).
3. AI menjamin variasi soal tanpa batas — setiap sesi "Latihan Baru" harus
   menghasilkan kata/kalimat yang BERBEDA dari sesi sebelumnya, supaya jelas
   terlihat bahwa ini bukan bank soal statis yang bisa dihafal.

**Batasan etis yang wajib dipatuhi di seluruh aplikasi**:
- Jangan pernah menyebut atau menyimpulkan kondisi medis apa pun (disleksia,
  dsb) di UI maupun output AI. Gunakan istilah "pola kesulitan" saja.
- Nada bahasa selalu positif dan memotivasi. Hindari kata "salah", "gagal",
  "belum bisa" — ganti dengan ajakan mencoba lagi yang ramah.
- Tampilkan catatan singkat di halaman utama: aplikasi ini alat bantu latihan
  untuk pola yang sudah diketahui/diduga sebelumnya oleh orang tua/guru/
  psikolog, bukan alat untuk mendiagnosis.

---

## TECH STACK

- React + Next.js + TypeScript
- Tailwind CSS untuk styling
- State cukup pakai React hooks (useState), tidak perlu library eksternal
- Tidak perlu database, cukup state di memori untuk satu sesi
- Text-to-speech pakai Web Speech API bawaan browser
  (`window.speechSynthesis`), JANGAN pakai API eksternal berbayar untuk ini
- Panggilan ke AI lewat API (sesuaikan endpoint dengan environment yang
  tersedia; simpan API key sebagai environment variable, JANGAN hardcode)

---

## FITUR YANG HARUS DIBANGUN (berdasarkan prioritas)

### Must Have (wajib selesai)

1. **Halaman utama dengan catatan singkat**
   Judul aplikasi, penjelasan 1-2 kalimat, dan catatan ramah bahwa ini alat
   bantu latihan untuk pola yang sudah diketahui, bukan alat diagnosis.

2. **Pilih pola target**
   Dropdown berisi 5 pola (lihat DAFTAR POLA di bawah). Untuk demo, pola
   default/terpilih adalah **"Sering tertukar huruf mirip bentuk (b/d, p/q,
   m/w)"** — pastikan pola ini paling matang dan stabil.

3. **Generator soal latihan**
   Saat pola dipilih (atau tombol "Buat Latihan Baru" ditekan), panggil AI
   dengan PROMPT GENERATOR SOAL (lihat bagian PROMPT), minta 5-8 soal baru.
   Setiap soal berisi kata/kalimat yang secara sengaja mengandung tantangan
   pola tersebut, 2-3 opsi jawaban, dan teks untuk dibacakan.

4. **Game pilihan jawaban**
   Tampilkan satu soal per kartu. Sertakan:
   - Tombol "🔊 Dengarkan" yang memanggil `window.speechSynthesis` untuk
     membacakan `audio_text` soal tersebut dalam Bahasa Indonesia
     (`utterance.lang = 'id-ID'`)
   - 2-3 tombol opsi jawaban
   - Feedback instan saat opsi ditekan: animasi ringan + pesan positif kalau
     benar ("Betul sekali! 🎉"), atau ajakan coba lagi yang ramah kalau salah
     ("Hampir! Coba dengarkan sekali lagi ya 😊") — TIDAK ADA warna merah atau
     ikon silang besar yang terkesan menghakimi

5. **Kartu progres**
   Setelah minimal 5 soal dijawab, tampilkan tombol "Lihat Kartu Progres".
   Panggil AI dengan PROMPT KARTU PROGRES, kirim ringkasan jawaban (jumlah
   benar/perlu-latihan-lagi per soal), tampilkan hasil sebagai kartu hangat:
   - Ringkasan positif (tetap jujur soal berapa yang perlu diulang, tapi
     dibingkai sebagai progres, bukan nilai)
   - Saran singkat untuk orang tua (1-2 kalimat, actionable)

6. **Tombol "Latihan Baru"**
   Panggil ulang generator soal untuk pola yang sama, hasilkan set kata BARU
   yang berbeda dari sesi sebelumnya (penting untuk demo: tunjukkan soal
   sebelum dan sesudah berbeda, sebagai bukti tidak ada bank soal statis).

### Should Have (kalau waktu masih cukup)

7. Animasi/transisi saat kartu soal muncul (fade/scale, bukan langsung kaku).
8. Aktifkan 1 pola tambahan di dropdown (mis. kesalahan fonologis) sebagai
   bukti struktur data mendukung banyak pola, meski tidak perlu sekuat pola
   utama.

### Tidak Perlu Dibangun (di luar scope, jangan buang waktu di sini)

- Speech-to-text / pengenalan suara anak
- Login/autentikasi
- Database/penyimpanan permanen
- Dukungan penuh untuk semua 5 pola sekaligus
- Riwayat lintas sesi

---

## DAFTAR POLA (untuk dropdown F1)

Gunakan lima pola ini sebagai pilihan (id, nama tampilan, deskripsi singkat).
Pola pertama adalah fokus utama demo, pastikan paling matang:

1. `pembalikan_huruf_mirip` — **"Sering tertukar huruf mirip bentuk (b/d, p/q, m/w, n/u)"** — FOKUS UTAMA DEMO
2. `pembalikan_urutan_huruf` — "Sering terbalik urutan huruf dalam kata"
3. `kesalahan_fonologis` — "Menulis kata sesuai bunyi sehari-hari, bukan ejaan baku"
4. `penghilangan_penambahan_huruf` — "Sering ada huruf yang hilang atau berlebih"
5. `tanpa_pola_tertentu` — "Belum ada pola spesifik, latihan umum saja"

---

## PROMPT UNTUK PANGGILAN AI

### Prompt Generator Soal Latihan

Gunakan teks berikut secara VERBATIM sebagai instruksi ke model AI, ganti
bagian `{pola_id}`, `{pola_nama}`, dan `{jumlah_soal}` sesuai konteks:

```
Kamu adalah generator soal latihan baca-tulis untuk anak SD kelas 1-3
berbahasa Indonesia. Tugasmu membuat soal latihan yang secara SENGAJA
menargetkan satu pola kesulitan tertentu, supaya anak berlatih tepat sasaran.

Pola target: {pola_id} ({pola_nama})

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
- Buat {jumlah_soal} soal. WAJIB semuanya soal BARU dan berbeda dari
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
}
```

**Contoh pemanggilan (user message):**
```
pola_id: pembalikan_huruf_mirip
pola_nama: Sering tertukar huruf mirip bentuk (b/d, p/q, m/w, n/u)
jumlah_soal: 6
```

**Contoh output yang diharapkan (sebagian):**
```json
{
  "soal": [
    {
      "kata_target": "domba",
      "audio_text": "domba",
      "opsi_jawaban": ["domba", "bomba", "bomda"],
      "jawaban_benar": "domba"
    },
    {
      "kata_target": "payung",
      "audio_text": "payung",
      "opsi_jawaban": ["payung", "qayung", "payunq"],
      "jawaban_benar": "payung"
    }
  ]
}
```

### Prompt Kartu Progres

Gunakan teks berikut secara VERBATIM, kirim ringkasan hasil jawaban anak
(jumlah benar dari total, pola target) sebagai data di user message:

```
Kamu membuat rangkuman progres latihan baca-tulis anak untuk ditampilkan ke
orang tua/guru, dengan nada HANGAT dan MEMOTIVASI. Ini BUKAN rapor atau nilai
ujian — ini kartu progres latihan biasa yang tujuannya menyemangati anak
untuk terus berlatih.

Kamu akan menerima:
- pola_target: pola yang sedang dilatih
- total_soal: jumlah soal yang dikerjakan
- jumlah_benar: jumlah jawaban benar

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
}
```

**Contoh pemanggilan (user message):**
```
pola_target: Sering tertukar huruf mirip bentuk (b/d, p/q, m/w, n/u)
total_soal: 6
jumlah_benar: 4
```

**Contoh output yang diharapkan:**
```json
{
  "ringkasan_positif": "Kerja bagus! Dari 6 kata latihan huruf mirip, 4 sudah tepat. Dua kata lainnya masih perlu sedikit latihan lagi, dan itu wajar banget di tahap belajar seperti ini.",
  "saran_untuk_orang_tua": "Coba ulangi latihan ini besok dengan kata-kata baru, dan ajak anak mengucapkan huruf b dan d sambil menunjuk bentuknya di udara supaya makin terbiasa membedakan."
}
```

---

## DATASET FALLBACK (kalau panggilan AI gagal/lambat saat demo)

Siapkan set soal statis berikut sebagai cadangan HANYA untuk pola
`pembalikan_huruf_mirip`, supaya demo tidak terhenti kalau API bermasalah:

```typescript
const FALLBACK_SOAL = [
  { kata_target: "buku", audio_text: "buku", opsi_jawaban: ["buku", "duku", "puku"], jawaban_benar: "buku" },
  { kata_target: "bola", audio_text: "bola", opsi_jawaban: ["bola", "dola", "wola"], jawaban_benar: "bola" },
  { kata_target: "domba", audio_text: "domba", opsi_jawaban: ["domba", "bomba", "bomda"], jawaban_benar: "domba" },
  { kata_target: "meja", audio_text: "meja", opsi_jawaban: ["meja", "weja", "meja"], jawaban_benar: "meja" },
  { kata_target: "payung", audio_text: "payung", opsi_jawaban: ["payung", "qayung", "payunq"], jawaban_benar: "payung" },
  { kata_target: "sepatu", audio_text: "sepatu", opsi_jawaban: ["sepatu", "zepatu", "sepatu"], jawaban_benar: "sepatu" }
];
```

---

## DESAIN UI/UX

Gaya visual harus **fun dan ramah anak** (target langsung dipakai anak SD
kelas 1-3 untuk bermain, didampingi orang dewasa). Bayangkan gaya visual
seperti aplikasi belajar anak (Duolingo Kids, buku cerita bergambar), bukan
form/dashboard.

**Elemen visual wajib:**
- Palet warna cerah dan playful: kuning, biru muda, hijau mint, ungu pastel.
- Bentuk serba membulat di semua card, tombol, input.
- Ikon/emoji terkait literasi dan permainan anak (buku, bintang, lonceng,
  karakter maskot sederhana) di judul section, tombol, empty state.
- Font judul playful tapi tetap terbaca, font body mudah dibaca.
- Animasi kecil menyenangkan: kartu soal muncul dengan fade/scale, bounce
  halus di tombol, konfeti/bintang kecil saat jawaban benar.
- Kartu progres dikemas hangat seperti "kartu ucapan", bukan rapor formal.

**Yang tetap harus dijaga:**
- Teks untuk orang tua (ringkasan_positif, saran_untuk_orang_tua) tetap
  jelas dan actionable, jangan sampai terlalu playful sampai sulit dipahami.
- Catatan "ini alat bantu latihan, bukan diagnosis" tetap terlihat di
  halaman utama, boleh dikemas ramah (ikon info/lonceng, warna lembut).
- HINDARI warna merah/oranye menyala dan ikon silang besar untuk jawaban
  yang perlu diulang — pakai warna netral-hangat dan pesan ramah.
- Ukuran teks dan tombol besar dan mudah diklik anak-anak.

**Layout**: single-page, area pilih pola di atas (seperti memilih
"tantangan" bukan form biasa), kartu soal di tengah (satu per waktu, dengan
tombol dengarkan besar dan jelas), kartu progres muncul sebagai section
khusus setelah dipicu.

---

## URUTAN PENGERJAAN YANG DISARANKAN

1. Setup project Next.js + TypeScript + Tailwind.
2. Bangun struktur data dasar (SoalLatihan, SesiLatihan) dan state management.
3. Bangun UI pilih pola + tampilan kartu soal dengan data FALLBACK dulu
   (tanpa panggilan AI), pastikan alur game (pilih jawaban → feedback)
   jalan mulus.
4. Integrasikan Web Speech API untuk tombol "Dengarkan".
5. Integrasikan panggilan AI untuk generator soal, bungkus try-catch dengan
   fallback ke dataset statis kalau gagal/timeout.
6. Bangun tombol "Latihan Baru" yang memanggil ulang generator, pastikan
   soal yang muncul terlihat berbeda dari sebelumnya (tes manual 2-3 kali).
7. Integrasikan panggilan AI untuk kartu progres, bangun tampilannya.
8. Tambahkan catatan etis di halaman utama, polish animasi/UI, tes ulang
   seluruh alur dari awal sampai akhir minimal 2 kali.
9. Kalau waktu masih ada, tambahkan pola kedua di dropdown.

---

## CATATAN AKHIR UNTUK AGENT

Prioritaskan aplikasi yang BENAR-BENAR JALAN dan stabil untuk demo langsung.
Kalau harus memotong sesuatu, potong dari styling/polish atau pola
tambahan, JANGAN dari alur inti (pilih pola → soal dihasilkan AI → main
game → kartu progres → latihan baru dengan soal berbeda), karena bukti
bahwa soal selalu baru (bukan bank statis) adalah inti dari cerita produk
ini saat demo.
