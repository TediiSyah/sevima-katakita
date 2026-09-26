import { NextResponse } from "next/server";
import { generateKartuProgres } from "@/lib/ai";

export async function POST(request: Request) {
  let polaTarget = "";
  let totalSoal = 0;
  let jumlahBenar = 0;

  try {
    const body = await request.json();
    polaTarget = body.pola_target ?? "";
    totalSoal = body.total_soal ?? 0;
    jumlahBenar = body.jumlah_benar ?? 0;
  } catch {
    return NextResponse.json({ error: "Body request tidak valid" }, { status: 400 });
  }

  if (!polaTarget || totalSoal === 0) {
    return NextResponse.json(
      { error: "pola_target dan total_soal wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const kartu = await generateKartuProgres(polaTarget, totalSoal, jumlahBenar);
    return NextResponse.json({ ...kartu, from_ai: true });
  } catch (error) {
    console.error("Error generating kartu progres:", error);

    // Fallback kartu progres statis
    const persentase = totalSoal > 0 ? Math.round((jumlahBenar / totalSoal) * 100) : 0;

    let ringkasan: string;
    let saran: string;

    if (persentase >= 80) {
      ringkasan = `Luar biasa! Dari ${totalSoal} kata latihan, ${jumlahBenar} sudah tepat. Terus semangat berlatih ya! 🌟`;
      saran =
        "Coba latihan dengan kata-kata baru besok untuk memperkuat kemampuan yang sudah bagus ini.";
    } else if (persentase >= 50) {
      ringkasan = `Bagus! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Beberapa kata masih butuh latihan lagi, dan itu wajar banget di tahap belajar ini. 😊`;
      saran =
        "Ulangi latihan ini 2-3 kali dengan kata yang berbeda, sambil ajak anak mengucapkan huruf yang mirip satu per satu.";
    } else {
      ringkasan = `Keren sudah mencoba! Dari ${totalSoal} kata, ${jumlahBenar} sudah tepat. Ini baru awal latihan — semakin sering berlatih, semakin lancar! 💪`;
      saran =
        "Lakukan latihan singkat ini setiap hari selama 5-10 menit. Konsistensi lebih penting dari durasi panjang.";
    }

    return NextResponse.json({
      ringkasan_positif: ringkasan,
      saran_untuk_orang_tua: saran,
      from_ai: false,
      fallback_reason: (error as Error).message,
    });
  }
}
