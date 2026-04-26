import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Caltech HackTech 2026 — see your thoughts",
  description:
    "You can't see how the algorithm shapes your thinking. We made it visible. A pitch deck for the Caltech HackTech 2026 entry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmMono.variable} ${dmSans.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
