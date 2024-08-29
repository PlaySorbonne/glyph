import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          async
          defer
          data-website-id="b338f2f6-7f8d-4885-b1ff-c59afe131f3f"
          src="https://stats.backend.playsorbonne.fr/umami.js"
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
