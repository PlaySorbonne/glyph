import { getUserFromSession } from "@/actions/auth";
import {
  getAvailableMainQuests,
  getFinishedMainQuests,
  getMainQuests,
  getUnavailableMainQuests,
} from "@/actions/quests";
import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/assets/icons";
import { cutString } from "@/utils";
import Link from "next/link";

export const revalidate = 3600; // invalidate every hour

export default async function Book() {
  let user = await getUserFromSession();
  let questNb = (await getMainQuests()).length;
  let [quests, finishedQuests, unavailableQuest] = await Promise.all([
    getAvailableMainQuests(user!.id),
    getFinishedMainQuests(user!.id),
    getUnavailableMainQuests(),
  ]);

  unavailableQuest = unavailableQuest
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

  return (
    <div className={styles.wrapper}>
      {questNb === finishedQuests.length && (
        <section className={styles.finishedWrapper}>
          <div className={styles.finishedContent}>
            <h1 className={styles.title}>Félicitations !</h1>
            <div className={styles.finishedDesc}>
              <p className={styles.finishedDescText}>
                Félicitations, aventurier ! Vous avez reconstitué le GLYPH,
                symbole du jeu et de l&apos;imagination. Grâce à vous,
                l&apos;esprit-jeu perdure à travers les générations. Votre
                bravoure fait de vous une légende.
              </p>
              <p className={styles.finishedDescText}>
                Mais l&apos;aventure continue ! Les rivalités entre fratries
                persistent et votre maison compte sur vous. Rendez-vous le{" "}
                <b>samedi 28 septembre, au Play Sorbonne Festival</b>, pour{" "}
                <b>l&apos;ultime défi</b>. Rassemblez vos camarades et menez
                votre fraternité à la victoire !
              </p>
              <p>La partie n’est jamais vraiment finie…</p>
            </div>

            <div className={styles.btnWrapper}>
              <Link
                href="https://playsorbonne.fr/festival"
                className={styles.finishedButton}
              >
                Page du Festival
              </Link>
            </div>
          </div>
        </section>
      )}
      <h1 className={styles.title}>Quêtes du Glyph</h1>
      <p className={styles.description}>
        Accomplissez les quêtes pour progresser et découvrir le campus
      </p>
      <section className={styles.quests}>
        {quests.map((quest) => (
          <Link
            href={"/app/quest/" + quest.id}
            key={quest.id}
            className={styles.quest}
          >
            <Image src={icons.lock} alt="lock" className={styles.lock} />
            <div className={styles.questContent}>
              <h3 className={styles.questTitle}>{quest.title}</h3>
              <p className={styles.questDescription}>
                {cutString(quest.mission, 100)}{" "}
                {quest.description && quest.description.length > 100 && (
                  <span className={styles.more}>{" Plus..."}</span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {unavailableQuest.length > 0 && (
        <section className={styles.quests}>
          {unavailableQuest.map((quest) => (
            <Link
              href={"/app/quest/" + quest.id}
              key={quest.id}
              className={styles.quest}
            >
              <Image src={icons.lock} alt="check" className={styles.lock} />
              <div className={styles.questContent}>
                <h3 className={styles.questTitle}>{quest.title}</h3>
                <p className={styles.questDescription}>
                  {cutString(quest.mission, 100)}{" "}
                  {quest.description && quest.description.length > 100 && (
                    <span className={styles.more}>{" Plus..."}</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}

      {finishedQuests.length > 0 && (
        <section className={styles.quests}>
          {finishedQuests.map((quest) => (
            <Link
              href={"/app/quest/" + quest.id}
              key={quest.id}
              className={styles.quest}
            >
              <Image src={icons.check} alt="check" className={styles.lock} />
              <div className={styles.questContent}>
                <h3 className={styles.questTitle}>{quest.title}</h3>
                <p className={styles.questDescription}>
                  {cutString(quest.mission, 100)}{" "}
                  {quest.description && quest.description.length > 100 && (
                    <span className={styles.more}>{" Plus..."}</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
