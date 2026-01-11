import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { DriftAvatar } from "@/components/gamification/drift-avatar";

export const metadata: Metadata = {
  title: "ALLAInOne - Your AI-Powered Life Assistant",
  description: "Unified assistant hub for tracking goals, todos, habits, meals, and more with an AI companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <DriftAvatar />
        </Providers>
      </body>
    </html>
  );
}
