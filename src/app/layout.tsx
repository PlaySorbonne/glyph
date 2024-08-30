import { Inter } from "next/font/google";
import "./globals.css";
import ErrorLabel from "./components/ErrorLabel";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
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
      <body className={inter.className}>
        <ErrorLabel />
        {children}
      </body>
    </html>
  );
}
