import dotenv from "dotenv";
import path from "path";

// Muat .env dari folder backend atau .env.local dari parent
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export const config = {
  port: parseInt(process.env.BACKEND_PORT || process.env.PORT || "5000", 10),
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiApiUrl:
    process.env.GEMINI_API_URL ||
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
  corsOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ],
};
