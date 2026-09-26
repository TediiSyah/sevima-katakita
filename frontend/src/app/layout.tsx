import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generator Latihan Pola Baca-Tulis | Belajar Seru Bersama!",
  description:
    "Aplikasi alat bantu latihan baca-tulis untuk anak SD yang disesuaikan dengan pola kesulitan spesifik mereka. Dibuat untuk membantu orang tua dan guru memberikan latihan yang terus bervariasi dan tepat sasaran.",
  keywords: ["belajar baca", "latihan anak", "baca tulis", "bahasa indonesia", "SD"],
  openGraph: {
    title: "Generator Latihan Pola Baca-Tulis",
    description: "Latihan baca-tulis seru dan tepat sasaran untuk anak SD kelas 1-3",
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
