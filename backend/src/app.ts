import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.routes";
import { config } from "./config/env";

export function createApp(): express.Application {
  const app = express();

  // Middleware CORS untuk mengizinkan request dari frontend Next.js
  app.use(
    cors({
      origin: (origin, callback) => {
        // Izinkan request tanpa origin (seperti curl, mobile app) atau dari origin yang terdaftar
        if (!origin || config.corsOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
          callback(null, true);
        } else {
          callback(null, true); // Permisif untuk lingkungan dev hackathon
        }
      },
      credentials: true,
    })
  );

  // Parse JSON bodies
  app.use(express.json());

  // Simple request logging
  app.use((req, _res, next) => {
    console.log(`[Backend ${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });

  // Pasang routes API
  app.use("/api", apiRoutes);

  // Root endpoint
  app.get("/", (_req, res) => {
    res.json({
      message: "Backend Service Generator Pola Baca-Tulis berjalan normal.",
      endpoints: {
        health: "/api/health",
        generateSoal: "POST /api/generate-soal",
        kartuProgres: "POST /api/kartu-progres",
      },
    });
  });

  return app;
}
