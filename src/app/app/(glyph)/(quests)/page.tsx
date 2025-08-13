import {
  getAvailableMainQuests,
  getAvailableSecondaryQuests,
  getUnavailableSecondaryQuests,
} from "@/actions/quests";
import styles from "./page.module.css";
import { getUserFromSession } from "@/actions/auth";
import MainQuestSlider from "./components/MainQuestSlider";
import icons from "@/assets/icons";
import SecondaryQuestList from "./components/SecondaryQuestList";

export const revalidate = 3600; // invalidate every hour

export default async function Home() {
  let user = await getUserFromSession();
  let [secondaryQuests, unavailableSecondaryQuests] = await Promise.all([
    getAvailableSecondaryQuests(user!.id),
    getUnavailableSecondaryQuests(),
  ]);
  let mainQuests = await getAvailableMainQuests(user!.id);

  unavailableSecondaryQuests = unavailableSecondaryQuests
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
  
  let quests = [...secondaryQuests, ...unavailableSecondaryQuests];

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <section
        className={styles.section}
        style={{
          backgroundImage: `url(${icons.corner.src}), url(${icons.corner2.src})`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition:
            "top -0.5rem right 0.5rem, bottom -0.5rem left 0.5rem",
          backgroundSize: "100px 100px, 100px 100px",
          position: "relative",
          padding: "2rem",
        }}
      >
        <MainQuestSlider quests={mainQuests} />
      </section>

      <section
        className={styles.section}
        style={{
          backgroundImage: `url(${icons.corner.src}), url(${icons.corner2.src})`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition:
            "top -0.5rem right 0.5rem, bottom -0.5rem left 0.5rem",
          backgroundSize: "100px 100px, 100px 100px",
          position: "relative",
          padding: "2rem",
        }}
      >
        <SecondaryQuestList quests={quests} />
      </section>

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
