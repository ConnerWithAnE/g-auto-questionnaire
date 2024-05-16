import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./Navigation/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Grifols Auto Questionnaire",
  description: "Get that questionnaire done quick",
  icons: {
    icon: ['/icon.ico?v=4'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#cccccc]`}>
        <Navbar />
        {children}</body>
    </html>
  );
}
