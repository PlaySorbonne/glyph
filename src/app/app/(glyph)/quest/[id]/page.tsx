import { getUserFromSession } from "@/actions/auth";
import { getQuest, hasUserFinishedQuest } from "@/actions/quests";
import { appUrl, isQuestAvailable } from "@/utils";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import icons from "@/assets/icons";
import Image from "next/image";
import Setting from "../../account/components/Setting";
import { getGlyph } from "@/assets/glyphs";
import Link from "next/link";

export default async function QuestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ finished?: string }>;
}) {
  let questId = parseInt((await params).id);
  if (isNaN(questId)) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }
  let user = await getUserFromSession();
  let hasFinishedQuest = await hasUserFinishedQuest(
    user!.id,
    parseInt((await params).id)
  );
  let quest = await getQuest((await params).id);

  if (!quest) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }

  if (!hasFinishedQuest && !isQuestAvailable(quest)) {
    quest = {
      ...quest,
      ...(quest.starts
        ? {
            mission:
              "La quête sera disponible à partir du " +
              quest.starts.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
          }
        : {
            mission:
              "La quête est actuellement indisponible\n" +
              (quest.mission ?? ""),
          }),
      title: Array.from(
        { length: 4 + Math.floor(Math.random() * 9) },
        () => "█"
      ).join(""),
      description: null,
      lore: null,
      indice: null,
    };
  }

  let indices =
    quest.indice &&
    quest!.indice
      .split("\n")
      .filter((e) => e)
      .map((e) => e.trim());

  return (
    <div>
      {((await searchParams).finished || hasFinishedQuest) && (
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
            width: "100%",
          }}
        >
          <h1
            className={styles.title}
            style={{
              minWidth: "50%",
            }}
          >
            {quest.title}
          </h1>
          <h3
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              fontSize: "1.2rem",
            }}
          >
            {quest.lieu}
          </h3>
        </div>
        <p
          style={{
            paddingBottom: "1rem",
          }}
        >
          {quest.horaires}
        </p>
        <p>{quest.mission}</p>
      </section>

      {quest.description && (
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>Description</h1>
          <p>{quest.description}</p>
        </section>
      )}

      {indices && (
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>
            Indice{indices.length > 1 ? "s" : ""}
          </h1>
          {indices.map((indice, index) => (
            <Setting key={index} label={`Indice ${index + 1}`} type="children">
              {indice.startsWith("http") ? (
                <Link
                  href={indice}
                  passHref
                  target="_blank"
                  style={{
                    wordBreak: "break-all",
                    color: "blue",
                  }}
                >
                  {indice}
                </Link>
              ) : (
                <p
                  style={{
                    wordBreak: "break-all",
                  }}
                >
                  {indice}
                </p>
              )}
            </Setting>
          ))}
        </section>
      )}

      {!quest.secondary && (
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
              <Image
                src={getGlyph(quest.img)}
                alt="quête terminée"
                height={400}
                style={{
                  imageRendering: "pixelated",
                }}
              />
            ) : (
              <Image src={icons.lock} alt="quête vérouillé" width={100} />
            )}
          </div>
        </section>
      )}

      {hasFinishedQuest && quest.lore && (
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>Lore</h1>
          <p>{quest.lore}</p>
        </section>
      )}
    </div>
  );
}
