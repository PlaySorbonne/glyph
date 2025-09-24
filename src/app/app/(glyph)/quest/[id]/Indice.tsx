"use client";

export default function Indice({
  title,
  indice,
}: {
  title: string;
  indice: string;
}) {
  return (
    <details className="mb-4" style={{
      width: "100%",
    }}>
      <summary className="cursor-pointer font-bold underline">{title}</summary>
      <div className="mt-2 whitespace-pre-wrap">{indice}</div>
    </details>
  );
}
