import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Roboto } from "next/font/google";
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

// Roboto — Clay-aligned display face for headers where data clarity wins
// over the lowercase-mono identity. Apply via .display-roboto class.
const roboto = Roboto({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      className={`${dmMono.variable} ${dmSans.variable} ${roboto.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
