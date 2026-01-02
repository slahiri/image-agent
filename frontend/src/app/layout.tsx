import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/layout";

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
      <body className="font-sans antialiased bg-zinc-950 text-zinc-100">
        <AppSidebar />
        <main className="ml-56 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
