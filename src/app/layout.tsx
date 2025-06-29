import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FlashMessageProvider } from "@/contexts/FlashMessageContext";
import { NotificationHandler } from "@/components/NotificationHandler";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {process.env.NODE_ENV !== "development" && (
          <script
            async
            defer
            data-website-id="b338f2f6-7f8d-4885-b1ff-c59afe131f3f"
            src="https://stats.backend.playsorbonne.fr/umami.js"
          ></script>
        )}
      </head>
      <body className={inter.className}>
        <NotificationProvider>
          <FlashMessageProvider>
            <Suspense fallback={null}>
              <NotificationHandler />
            </Suspense>
            {children}
          </FlashMessageProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}