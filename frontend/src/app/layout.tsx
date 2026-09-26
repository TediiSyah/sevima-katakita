import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KataKita — Generator Latihan Pola Baca-Tulis",
  description: "Aplikasi latihan baca-tulis personal berbasis AI untuk anak SD",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
