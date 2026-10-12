import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StyleScribe — Descripciones de productos de moda con IA",
  description:
    "Genera descripciones de productos atractivas para tu tienda de ropa en segundos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
