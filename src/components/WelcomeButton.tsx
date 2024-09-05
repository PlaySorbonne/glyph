import Link from "next/link";
import React from "react";

export default function WelcomeButton(props: {
  link: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={props.link}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        fontWeight: "bold",
        padding: "1rem",
        borderRadius: "1rem",
        textAlign: "center",
        textDecoration: "none",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        fontFamily: "DCC-Ash",
        letterSpacing: "0.1rem",
        fontSize: "1.2rem",
      }}
    >
      {props.children}
    </Link>
  );
}
