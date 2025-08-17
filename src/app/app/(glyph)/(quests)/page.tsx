import {
  getAvailableMainQuests,
  getAvailableSecondaryQuests,
  getUnavailableSecondaryQuests,
} from "@/actions/quests";
import styles from "./page.module.css";
import { getUserFromSession } from "@/actions/auth";
import MainQuestSlider from "./MainQuestSlider";
import icons from "@/assets/icons";
import QuestList from "../components/QuestList";
import { keepKeysFromObjectArray } from "@/utils";

export const revalidate = 3600; // invalidate every hour

const secondaryKeys = ["id", "title", "description", "starts", "ends"] as const;
const mainKeys = ["id", "title", "description", "mission"] as const;

export default async function Home() {
  let user = await getUserFromSession();
  let [secondaryQuests, unavailableSecondaryQuests, mainQuests] =
    await Promise.all([
      getAvailableSecondaryQuests(user!.id),
      getUnavailableSecondaryQuests(user!.id).then((quests) =>
        quests
          .filter((q) => !q.ends || q.ends >= new Date())
          .map((quest) => {
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
          .sort((a, b) => a.starts!.getTime() - b.starts!.getTime())
      ),
      getAvailableMainQuests(user!.id),
    ]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {mainQuests && mainQuests.length > 0 && (
        <section
          className={styles.section}
          style={{
            backgroundImage: `url(${icons.corner.src}), url(${icons.corner2.src})`,
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition:
              "top -0.5rem right 0.5rem, bottom -0.5rem left 0.5rem",
            backgroundSize: "100px 100px, 100px 100px",
            padding: "2rem",
            overflow: "hidden",
          }}
        >
          <MainQuestSlider
            quests={keepKeysFromObjectArray(mainQuests, mainKeys)}
          />
        </section>
      )}

      {((secondaryQuests && secondaryQuests.length > 0) ||
        (unavailableSecondaryQuests &&
          unavailableSecondaryQuests.length > 0)) && (
        <section
          className={styles.section}
          style={{
            backgroundImage: `url(${icons.corner.src}), url(${icons.corner2.src})`,
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition:
              "top -0.5rem right 0.5rem, bottom -0.5rem left 0.5rem",
            backgroundSize: "100px 100px, 100px 100px",
            padding: "2rem",
          }}
        >
          <QuestList
            quests={keepKeysFromObjectArray(secondaryQuests, secondaryKeys)} // keeping only relevant keys so no "sensitive" data is sent to the client
            unavailableQuests={keepKeysFromObjectArray(
              unavailableSecondaryQuests,
              secondaryKeys
            )}
          />
        </section>
      )}

      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "0.5rem",
          padding: "1rem",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          fontSize: "1.5rem",
          fontWeight: "600",
        }}
      >
        <p>
          Retrouvez-nous à nos permanences devant la maison de vie étudiante
          pour plus de quêtes !
        </p>
      </div>
    </div>
  );
}
