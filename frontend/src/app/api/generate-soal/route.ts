import { NextResponse } from "next/server";
import { generateSoal } from "@/lib/ai";
import { FALLBACK_SOAL, FALLBACK_SOAL_FONOLOGIS } from "@/data/pola";

export async function POST(request: Request) {
  let polaId = "";
  let polaNama = "";
  let jumlahSoal = 6;

  try {
    const body = await request.json();
    polaId = body.pola_id ?? "";
    polaNama = body.pola_nama ?? "";
    jumlahSoal = body.jumlah_soal ?? 6;
  } catch {
    return NextResponse.json(
      { error: "Body request tidak valid" },
      { status: 400 }
    );
  }

  if (!polaId || !polaNama) {
    return NextResponse.json(
      { error: "pola_id dan pola_nama wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const soal = await generateSoal(polaId, polaNama, jumlahSoal);
    return NextResponse.json({ soal, from_ai: true });
  } catch (error) {
    console.error("Error generating soal:", error);

    // Fallback ke data statis
    let fallback = FALLBACK_SOAL;
    if (polaId === "kesalahan_fonologis") {
      fallback = FALLBACK_SOAL_FONOLOGIS;
    }

    // Shuffle fallback untuk kesan variasi
    const shuffled = [...fallback].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      soal: shuffled,
      from_ai: false,
      fallback_reason: (error as Error).message,
    });
  }
}
