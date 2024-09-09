"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ErrorLabel() {
  let [show, setShow] = useState(true);
  let searchParams = useSearchParams();
  let error = searchParams.get("error");
  
  
  if (!show) return null;
  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "0 0 10px 10px",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "red",
        color: "white",
        padding: "10px",
        display: "flex",
        gap: "10px",
        zIndex: 1000,
      }}
    >
      <p>{error}</p>
      <button
        onClick={() => setShow(false)}
        style={{
          backgroundColor: "white",
          color: "red",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        X
      </button>
    </div>
  );
}
