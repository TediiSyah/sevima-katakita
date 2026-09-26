import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KataKita — Latihan Baca-Tulis Seru dengan AI",
  description:
    "Platform latihan ejaan adaptif berbasis Gemini AI untuk anak SD kelas 1–3. Soal selalu baru setiap sesi, didampingi maskot Kiko dan sistem bintang gamifikasi.",
  keywords: ["latihan baca tulis", "belajar ejaan anak", "bahasa indonesia SD", "gamifikasi belajar", "kata kita"],
  themeColor: "#1B6FEF",
  openGraph: {
    title: "KataKita — Latihan Baca-Tulis Seru dengan AI",
    description: "Latihan ejaan adaptif berbasis AI untuk anak SD kelas 1–3",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#1B6FEF" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
