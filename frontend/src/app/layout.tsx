import type { Metadata } from "next";
import { Inter, Playfair_Display, Lora, Dancing_Script, Montserrat } from "next/font/google";
import "./globals.css";
import "../lib/design-system.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], variable: "--font-playfair-display" });
const lora = Lora({ subsets: ["latin", "vietnamese"], variable: "--font-lora" });
const dancingScript = Dancing_Script({ subsets: ["latin", "vietnamese"], variable: "--font-dancing-script" });
const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Mielove.vn - Nền tảng Tạo Thiệp Cưới Số",
  description: "Thiết kế thiệp cưới online đẹp mắt, nhanh chóng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} ${lora.variable} ${dancingScript.variable} ${montserrat.variable} font-sans text-stone-800`}>
        {children}
      </body>
    </html>
  );
}
