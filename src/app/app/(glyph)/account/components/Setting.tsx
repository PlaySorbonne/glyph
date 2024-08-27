"use client";

export default function Setting(
  props: { label: string } & (
    | { type: "link"; href: string }
    | { type: "children"; children: React.ReactNode }
    | {
        type: "button";
        onClick: (e: MouseEvent) => void;
      }
  )
) {
  return <></>;
}
