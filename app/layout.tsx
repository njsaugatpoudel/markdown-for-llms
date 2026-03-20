import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Markdown for LLMs",
  description: "Extract pure markdown from any URL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]`}>
        {children}
      </body>
    </html>
  );
}
