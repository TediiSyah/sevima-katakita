import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KataKita — Latihan Baca-Tulis Seru dengan AI",
  description:
    "Platform latihan ejaan adaptif berbasis Gemini AI untuk anak SD kelas 1–3. Soal selalu baru setiap sesi, didampingi maskot Kiko dan sistem bintang gamifikasi.",
  keywords: ["latihan baca tulis", "belajar ejaan anak", "bahasa indonesia SD", "gamifikasi belajar", "kata kita"],
  themeColor: "#1B6FEF",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "KataKita — Latihan Baca-Tulis Seru dengan AI",
    description: "Latihan ejaan adaptif berbasis AI untuk anak SD kelas 1–3",
    locale: "id_ID",
    type: "website",
    images: ["/Kiko1.png"],
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
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/icon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png?v=2" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
