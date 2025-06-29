"use client";

import { useState } from "react";
import styles from "./CodeScan.module.css";
import Image from "next/image";
import icons from "@/assets/icons";
import { handleUserScanForm } from "./actions";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function CodeScan() {
  const [opened, setOpened] = useState(false);
  const [openQR, setOpenQR] = useState(false);
  const [code, setCode] = useState("");

  function redirect(url: string) {
    window.location.href = url;
  }

  function close() {
    setOpened(false);
    setOpenQR(false);
  }

  function qrScan(result: any) {
    if (!result || !result[0]) return;
    const data = result[0].rawValue;
    if (
      data.startsWith(process.env.MAIN_URL) ||
      data.startsWith("https://glyph.playsorbonne.fr")
    )
      return redirect(data);
    else return redirect(`?error=Invalid QR code. got ${data}`);
  }

  function qrError(error: any) {
    redirect(`?error=${error.message}`);
  }

  return (
    <div>
      <button onClick={() => setOpened(!opened)}>
        <Image src={icons.qr} alt="qr" width={50} />
      </button>
      {opened && (
        <div className={styles.backdrop} onClick={() => close()}>
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

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
                borderTop: "1px solid black",
              }}
            >
              {!openQR && (
                <h1
                  className={styles.scanButton}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.4rem",
                    fontFamily: "DCC-Ash",
                    padding: "1rem",
                  }}
                  onClick={() => setOpenQR(true)}
                >
                  Ou scannez le QR code
                </h1>
              )}

              {openQR && (
                <Scanner
                  onScan={qrScan}
                  onError={qrError}
                  constraints={{
                    facingMode: "environment"
                  }}
                  styles={{
                    container: { width: "100%" }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}