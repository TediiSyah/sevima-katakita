import { Request, Response } from "express";
import { generateKartuProgresService } from "../services/ai.service";

export async function generateKartuProgresHandler(req: Request, res: Response): Promise<void> {
  try {
    const { pola_target, total_soal, jumlah_benar = 0 } = req.body;

    if (!pola_target || total_soal === undefined) {
      res.status(400).json({
        error: "pola_target dan total_soal wajib disertakan dalam request body",
      });
      return;
    }

    const result = await generateKartuProgresService(
      pola_target,
      Number(total_soal),
      Number(jumlah_benar)
    );
    res.json(result);
  } catch (error) {
    console.error("Internal error di generateKartuProgresHandler:", error);
    res.status(500).json({
      error: "Gagal memproses kartu progres",
      message: (error as Error).message,
    });
  }
}
