import { Router } from "express";
import { generateSoalHandler } from "../controllers/soal.controller";
import { generateKartuProgresHandler } from "../controllers/progres.controller";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Generator Latihan Pola Baca-Tulis API",
    time: new Date().toISOString(),
  });
});

// Endpoint generate soal latihan
router.post("/generate-soal", generateSoalHandler);

// Endpoint generate kartu progres
router.post("/kartu-progres", generateKartuProgresHandler);

export default router;
