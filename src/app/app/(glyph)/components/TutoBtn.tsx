"use client";

import { MouseEventHandler } from "react";

export default function TutoBtn({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) {
  return (
    <button onClick={onClick} style={{
      position: "fixed",
      bottom: "5rem",
      right: "1rem",
      zIndex: 5,
      backgroundColor: "rgba(255,175,3,0.8)",
      border: "1px solid black",
      borderRadius: "10rem",
      padding: "0.5rem 1rem",
    }}>
      ?
    </button>
  );
}
