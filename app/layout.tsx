import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NotificationInitializer } from "@/components/notification-initializer";
import ErrorBoundary from "@/components/error-boundary";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <NotificationInitializer />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
