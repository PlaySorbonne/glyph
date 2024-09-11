"use client";

import { useState } from "react";
import styles from "./CodeScan.module.css";
import Image from "next/image";
import icons from "@/assets/icons";
import { handleUserScanForm } from "./actions";

export default function CodeScan() {
  const [opened, setOpened] = useState(false);
  const [code, setCode] = useState("");
  
  return (
    <div>
      <button onClick={() => setOpened(!opened)}>
        <Image src={icons.qr} alt="qr" width={50} />
      </button>
      {opened && (
        <div className={styles.backdrop} onClick={() => setOpened(false)}>
          <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          <h1 className={styles.title}>Tapez le code</h1>
            <form action={handleUserScanForm} className={styles.form}>
              <input
                type="text"
                value={code}
                name="code"
                id="code"
                className={styles.input}
                onChange={(e) => setCode(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button className={styles.scanButton} type="submit">
                Scan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
