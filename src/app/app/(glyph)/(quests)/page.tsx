import {
  getAvailableMainQuests,
  getAvailableSecondaryQuests,
  getFinishedQuests,
  getUnavailableSecondaryQuests,
} from "@/actions/quests";
import { appUrl } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";
import { getUserFromSession } from "@/actions/auth";
import { getGlyph } from "@/assets/glyphs";
import Image from "next/image";
import MainQuestSlider from "./components/MainQuestSlider";
import { Quest } from "@prisma/client";

export const revalidate = 3600; // invalidate every hour

export default async function Home() {
  let user = await getUserFromSession();
  let [quests, finishedQuests, unavailableQuests] = await Promise.all([
    getAvailableSecondaryQuests(user!.id),
    getFinishedQuests(user!.id),
    getUnavailableSecondaryQuests(),
  ]);
  let mainQuests = await getAvailableMainQuests(user!.id);

  unavailableQuests = unavailableQuests
    .filter((q) => !q.ends || q.ends >= new Date())
    .map((quest) => {
      if (quest.ends && quest.ends < new Date()) {
        return null;
      }
      return {
        ...quest,
        title: Array.from(
          { length: 4 + Math.floor(Math.random() * 9) },
          () => "█"
        ).join(""),
        mission:
          "La quête sera disponible à partir du " +
          quest.starts!.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      };
    })
    .filter((quest) => quest !== null)
    .sort((a, b) => a.starts!.getTime() - b.starts!.getTime());

  let finishedSecondaryQuests = finishedQuests.filter(
    (quest) => quest.secondary
  );
  let finishedPrimaryQuests = finishedQuests.filter(
    (quest) => !quest.secondary
  );

  let questList = [...quests, ...unavailableQuests];

  return (
    <div>
      <div>
        <div
          style={{
            fontFamily: "DCC-Ash",
            letterSpacing: "0.1rem",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "0.5rem",
            padding: "1rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            fontSize: "1.5rem",
          }}
        >
          <p>
            Retrouvez-nous à nos permanences devant la maison de vie étudiante
            pour plus de quêtes !
          </p>
        </div>

        <section className={styles.section}>
          <MainQuestSlider quests={mainQuests} />
        </section>

        {/* {finishedSecondaryQuests.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Quêtes secondaires terminées
            </h2>
            <Quests quests={finishedSecondaryQuests} />
          </section>
        )} */}
      </div>
    </div>
  );
}
