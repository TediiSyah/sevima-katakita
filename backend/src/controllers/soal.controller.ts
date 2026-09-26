import { Request, Response } from "express";
import { generateSoalService } from "../services/ai.service";

export async function generateSoalHandler(req: Request, res: Response): Promise<void> {
  try {
    const { pola_id, pola_nama, jumlah_soal = 6 } = req.body;

    if (!pola_id || !pola_nama) {
      res.status(400).json({
        error: "pola_id dan pola_nama wajib disertakan dalam request body",
      });
      return;
    }

    const result = await generateSoalService(pola_id, pola_nama, Number(jumlah_soal));
    res.json(result);
  } catch (error) {
    console.error("Internal error di generateSoalHandler:", error);
    res.status(500).json({
      error: "Gagal memproses pembuatan soal",
      message: (error as Error).message,
    });
  }
}
