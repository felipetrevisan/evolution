import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "@/styles/globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evolution",
  description: "Evolua com acompanhamento comportamental adaptativo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${inter.variable} ${geistMono.variable}`}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
