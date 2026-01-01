import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImageAI - AI Image Generation",
  description: "Create amazing images with AI using natural language",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
