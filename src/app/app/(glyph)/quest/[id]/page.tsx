import { getUserFromSession } from "@/actions/auth";
import { getQuest, hasUserFinishedQuest } from "@/actions/quests";
import { appUrl, glyphStringToArray, isQuestAvailable } from "@/utils";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import Setting from "../../account/components/Setting";
import Link from "next/link";
import PixelMatch from "@/app/app/components/PixelMatch";
import GlyphMatch from "./GlyphMatch";

export default async function QuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let paramsA = await params;
  let questId = parseInt(paramsA.id);
  if (isNaN(questId)) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }
  let user = await getUserFromSession();
  let hasFinishedQuest = await hasUserFinishedQuest(
    user!.id,
    parseInt(paramsA.id)
  );
  let quest = await getQuest(paramsA.id);

  if (!quest) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }

  let glyph = glyphStringToArray(quest.glyph) ?? [[]];

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
    quest.indice
      .split("\n")
      .filter((e) => e)
      .map((e) => e.trim());

  return (<div style={{
    width: "100%",
  }}>
    <section className={styles.section}>
      uwu
    </section>
  </div>);
}
