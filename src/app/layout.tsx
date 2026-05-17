/**
 * @file layout.tsx
 * @description アプリのルートレイアウト。Geist フォントの読み込みと共通 Providers の注入を担う。
 */
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kakeibo App",
  description: "家計簿データをアップロード・分析・レポート化する3ステップアプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * アプリ全体のルートレイアウト
 * @param props.children ルート配下に描画される要素
 * @returns html / body と共通 Providers を含むレイアウト要素
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
