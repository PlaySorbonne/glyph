import { getUserFromSession } from "@/actions/auth";
import { getQuest, hasUserFinishedQuest } from "@/actions/quests";
import { appUrl } from "@/utils";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import icons from "@/assets/icons";
import Image from "next/image";

export default async function QuestPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { finished?: string };
}) {
  let questId = parseInt(params.id);
  if (isNaN(questId)) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }
  let user = await getUserFromSession();
  let hasFinishedQuest = await hasUserFinishedQuest(
    user!.id,
    parseInt(params.id)
  );
  let quest = await getQuest(params.id);

  if (!quest) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }

  return (
    <div>
      {(searchParams.finished || hasFinishedQuest) && (
        <div
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Quête terminée !
        </div>
      )}
      <section className={styles.section}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className={styles.title}>{quest.title}</h1>
          <h3
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: "1.2rem",
            }}
          >
            {quest.lieu}
          </h3>
        </div>
        <p>{quest.mission}</p>
      </section>

      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Description</h1>
        <p>{quest.description}</p>
      </section>

      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Glyph</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          {hasFinishedQuest ? (
            <Image src={icons.check} alt="quête terminée" width={100} />
          ) : (
            <Image src={icons.lock} alt="quête vérouillé" width={100} />
          )}
        </div>
      </section>
    </div>
  );
}
