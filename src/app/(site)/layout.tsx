import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glyph",
  description:
    "Jeu de piste pour découvrir le campus Jussieu de Sorbonne Université !",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/ios/128.png" },
    { rel: "icon", url: "/ios/128.png" },
  ],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}