import icons from "@/assets/icons";
import Image from "next/image";

import styles from "./page.module.css";
import { getFinishedMainQuests } from "@/actions/quests";
import { getUserFromSession } from "@/actions/auth";
import Carte from "./Carte";

export default async function Map() {
  let user = await getUserFromSession();
  let quest = await getFinishedMainQuests(user!.id);
  let unlocked = quest.find((q) => q.title.trim() === "La Plume");

  if (unlocked) {
    return (
      <div className={styles.container}>
        <Carte />
      </div>
    );
  }

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
