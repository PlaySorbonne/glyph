"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import BooleanGridSVG from "../BooleanGridSVG";
import { HeroGlyphBool } from "@/utils";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <Link
        href="/app"
        className={`${styles.navItem} ${
          pathname === "/app" ? styles.active : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path
            id="Shape"
            d="M10.75,1.5A2.25,2.25,0,0,1,13,3.75v9.028h1.5V3.75A3.75,3.75,0,0,0,10.75,0H.75a.75.75,0,0,0,0,1.5C1.669,1.5,2,1.831,2,2.75v11A3.75,3.75,0,0,0,5.75,17.5h8V16h-8A2.25,2.25,0,0,1,3.5,13.75v-11A3.392,3.392,0,0,0,3.285,1.5Z"
            transform="translate(4.25 3.25)"
            fill="currentColor"
          />
          <path
            id="Shape-2"
            data-name="Shape"
            d="M7.765,17.5A3.294,3.294,0,0,0,10.738,16H7.754C9.307,16,10,15,10,12.749a.751.751,0,0,1,.751-.75h8a.751.751,0,0,1,.75.75v1a3.755,3.755,0,0,1-3.75,3.75ZM10.738,16H15.75A2.253,2.253,0,0,0,18,13.749V13.5H11.472A5.4,5.4,0,0,1,10.738,16ZM7,16.75A.72.72,0,0,1,7.749,16h0v1.5A.719.719,0,0,1,7,16.75ZM.75,5.5A.751.751,0,0,1,0,4.75v-2a2.75,2.75,0,1,1,5.5,0v2a.751.751,0,0,1-.75.75ZM1.5,2.75V4H4V2.75a1.25,1.25,0,1,0-2.5,0Z"
            transform="translate(2.25 3.25)"
            fill="currentColor"
          />
        </svg>
      </Link>
      <Link
        href="/app/glyph"
        className={`${styles.navItem} ${
          pathname === "/app/glyph" ? styles.active : ""
        }`}
      >
        <BooleanGridSVG grid={HeroGlyphBool} width={24} height={24}/>
      </Link>
      <Link
        href="/app/book"
        className={`${styles.navItem} ${
          pathname === "/app/book" ? styles.active : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
        </svg>
      </Link>
      <Link
        href="/app/account"
        className={`${styles.navItem} ${
          pathname === "/app/account" ? styles.active : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24"
          height="24"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </nav>
  );
}
