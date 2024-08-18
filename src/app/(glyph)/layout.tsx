import Navbar from "@/components/Navbar/Navbar";

export default function GlyphLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}