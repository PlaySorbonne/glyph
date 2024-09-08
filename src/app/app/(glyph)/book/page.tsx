import { getUserFromSession } from "@/actions/auth";
import { getAvailablePrimaryQuests, getFinishedQuests } from "@/actions/quests";
import Image from "next/image";
import styles from "./page.module.css";
import icons from "@/assets/icons";
import { cutString } from "@/utils";
import Link from "next/link";

export default async function Book() {
  let user = await getUserFromSession();
  let quests = await getAvailablePrimaryQuests(user!.id);
  let finishedQuests = await getFinishedQuests(user!.id);

  return (
    <div className={styles.wrapper}>
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
      {finishedQuests.length > 0 && (
        <section className={styles.quests}>
          {finishedQuests.map((quest) => (
            <Link
              href={"/app/quest/" + quest.id}
              key={quest.id}
              className={styles.quest}
            >
              {quest.img && quest.img.length > 0 ? (
                <Image src={quest.img} alt="quest" className={styles.lock} />
              ) : (
                <Image src={icons.check} alt="check" className={styles.lock} />
              )}
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
