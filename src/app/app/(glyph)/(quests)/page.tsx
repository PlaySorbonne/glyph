import {
  getAvailableSecondaryQuests,
  getFinishedQuests,
  getUnavailableSecondaryQuests,
} from "@/actions/quests";
import Quests from "./components/Quests";
import { appUrl } from "@/utils";
import Link from "next/link";
import styles from "./page.module.css";
import { getUserFromSession } from "@/actions/auth";
import { getGlyph } from "@/assets/glyphs";
import Image from "next/image";

export const revalidate = 3600; // invalidate every hour

export default async function Home() {
  let user = await getUserFromSession();
  let [quests, finishedQuests, unavailableQuests] = await Promise.all([
    getAvailableSecondaryQuests(user!.id),
    getFinishedQuests(user!.id),
    getUnavailableSecondaryQuests(),
  ]);

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
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "0.5rem",
            padding: "1rem",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "2px solid rgba(0, 0, 0, 0.9)",

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Link href={appUrl("/book")}>
            <h2
              className="text-2xl font-semibold mb-4"
              style={{
                fontFamily: "DCC-Ash",
                letterSpacing: "0.2rem",
                textAlign: "center",
              }}
            >
              Cliquez ici pour continuer de reconstituer le Glyph principal !
            </h2>

            <div
              style={{
                height: 200,
                width: 200,
              }}
            >
              {finishedPrimaryQuests.map((quest, index) => (
                <Image
                  src={getGlyph(quest.img)}
                  alt="glyph"
                  width={200}
                  key={index}
                  style={{
                    position: "absolute",
                    left: "20%",
                    imageRendering: "pixelated",
                  }}
                />
              ))}
            </div>
          </Link>
        </div>

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

        {questList.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Quêtes secondaires</h2>
            <Quests quests={questList} />
          </section>
        )}

        {finishedSecondaryQuests.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Quêtes secondaires terminées
            </h2>
            <Quests quests={finishedSecondaryQuests} />
          </section>
        )}
      </div>
    </div>
  );
}
