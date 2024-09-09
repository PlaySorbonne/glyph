import icons from "@/assets/icons";
import Image from "next/image";

import styles from "./page.module.css";

export default function Map() {
  return (
    <div className={styles.container}>
      <div>
        <Image
          src={icons.lock}
          alt="lock"
          className="w-32 h-32 text-gray-400 mb-4 mx-auto"
        />
        <p className="text-xl text-gray-600">
          Complétez la quete de la Plume pour débloquer la carte
        </p>
      </div>
    </div>
  );
}
