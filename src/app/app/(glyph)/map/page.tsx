import icons from "@/assets/icons";
import Image from "next/image";

import styles from "./page.module.css";
import { getFinishedPrimaryQuests } from "@/actions/quests";
import { getUserFromSession } from "@/actions/auth";

export default async function Map() {
  let user = await getUserFromSession();
  let quest = await getFinishedPrimaryQuests(user!.id);
  let unlocked = quest.find((q) => q.title.trim() === "La Plume");

  if (unlocked) {
    return (
      <div className={styles.container}>
        <div>
          <Image
            src={icons.check}
            alt="map"
            className="w-32 h-32 text-gray-400 mb-4 mx-auto"
          />
          <p className="text-xl text-gray-600">Vous devriez avoir accès à la carte mais elle arrive bientôt !</p>
        </div>
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
