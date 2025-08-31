import { getUserFromSession } from "@/actions/auth";
import { getQuest, getSubQuests, hasUserFinishedQuest } from "@/actions/quests";
import {
  appUrl,
  GLYPH_MAX_SIZE,
  glyphStringToArray,
  isQuestAvailable,
  NB_MAIN_QUESTS,
} from "@/utils";
import { redirect } from "next/navigation";
import icons from "@/assets/icons";
import Image from "next/image";
import GlyphMatch from "./GlyphMatch";
import PixelMatch from "@/app/app/components/PixelMatch";
import QuestList from "../../components/QuestList";

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
  let quest = await getQuest({ id: paramsA.id });

  if (!quest) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }

  let glyph = glyphStringToArray(quest.glyph) ?? [[]];

  let [nonFinishedSubQuests, finishedSubQuests] = await getSubQuests(
    quest.id,
    user!.id
  );

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

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <section
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          QUÊTE {quest.secondary ? "SECONDAIRE" : "PRINCIPALE"}
        </p>
        <Image
          src={icons.separator1}
          alt="Separator"
          style={{ width: "20rem", padding: "5px 0" }}
        />
        <p
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          {quest.title}
        </p>
      </section>

      <section
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          marginTop: "2rem",
          backgroundImage: `url(${icons.corner.src}), url(${icons.corner2.src})`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition:
            "top -0.5rem right 0.5rem, bottom -0.5rem left 0.5rem",
          backgroundSize: "100px 100px, 100px 100px",
          padding: "2rem",
        }}
      >
        {quest.mission && (
          <p>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              MISSION :{" "}
            </span>
            {quest.mission}
          </p>
        )}

        {quest.lieu && (
          <p>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Lieu :{" "}
            </span>
            {quest.lieu}
          </p>
        )}

        {quest.horaires && (
          <p>
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              Horaires :{" "}
            </span>
            {quest.horaires}
          </p>
        )}

        {quest.description && (
          <div
            style={{
              paddingTop: "1rem",
            }}
          >
            <h1
              style={{
                fontWeight: "bold",
                paddingBottom: "0.5rem",
              }}
            >
              DESCRIPTION
            </h1>
            <p
              style={{
                padding: "0 1rem",
                textAlign: "justify",
                whiteSpace: "pre-wrap",
              }}
            >
              {quest.description}
            </p>
          </div>
        )}

        {((finishedSubQuests?.length ?? 0) > 0 ||
          nonFinishedSubQuests?.length > 0) && (
          <QuestList
            quests={nonFinishedSubQuests}
            finishedQuests={finishedSubQuests}
            name="TÂCHES"
            clickable={false}
          />
        )}
      </section>

      {!quest.secondary && (
        <section
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            marginTop: "2rem",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              paddingBottom: "0.5rem",
              fontSize: "1.3rem",
            }}
          >
            FRAGMENT DU GLYPH
          </h1>
          {hasFinishedQuest ? (
            <PixelMatch defaultGlyph={glyphStringToArray(quest.glyph)} locked />
          ) : (
            <GlyphMatch
              questId={quest.id.toString()}
              glyphSize={[
                glyph?.length || GLYPH_MAX_SIZE,
                glyph?.[0]?.length || GLYPH_MAX_SIZE,
              ]}
            />
          )}
        </section>
      )}
    </div>
  );
}
