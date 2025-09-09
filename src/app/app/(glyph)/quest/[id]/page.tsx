import { getUserFromSession } from "@/actions/auth";
import { getQuest, getSubQuests, hasUserFinishedQuest } from "@/actions/quests";
import {
  appUrl,
  GLYPH_MAX_SIZE,
  glyphStringToArray,
  isQuestAvailable,
} from "@/utils";
import { redirect } from "next/navigation";
import icons from "@/assets/icons";
import Image from "next/image";
import GlyphMatch from "./GlyphMatch";
import PixelMatch from "@/app/app/components/PixelMatch";
import QuestList from "../../components/QuestList";
import { getHistoryByQuestId } from "@/actions/history";

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

  let history = await getHistoryByQuestId(questId, user!.id);

  if (!quest) {
    return redirect(appUrl("/?error=Cette quête n'existe pas"));
  }

  let glyphCheck = glyphStringToArray(quest.glyphCheck) ?? [[]];

  let [nonFinishedSubQuests, finishedSubQuests] = await getSubQuests(
    quest.id,
    user!.id
  );

  nonFinishedSubQuests = nonFinishedSubQuests
    .map((sq) => {
      if (!sq.hidden) return sq;

      return {
        ...sq,
        title: Array.from(
          { length: 4 + Math.floor(Math.random() * 9) },
          () => "█"
        ).join(""),
        clickable: false,
        description: null,
        lore: null,
        indice: null,
      };
    })
    .sort((a, b) => {
      const priority = (q: { hidden: boolean; clickable: boolean }) => {
        if (q.hidden) return 2;
        if (!q.clickable) return 1;
        return 0;
      };
      return priority(a) - priority(b);
    });

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
            mission: "La quête est actuellement indisponible\n",
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
      {/* {quest.title.includes("Héros") && !hasFinishedQuest && <TutoNew />} */}
      <section
        id="title-quest"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
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
        {hasFinishedQuest && (
          <>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "green",
              }}
            >
              Quête validée !
            </p>
            <p>
              Vous avez trouvé le fragment le{" "}
              {history?.date.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </>
        )}
      </section>

      <section
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          marginTop: "2rem",
          backgroundImage: `url(${icons.corner.src}), url(${icons.corner2.src})`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition:
            "top -0.5rem right 0.5rem, bottom -0.5rem left 0.5rem",
          backgroundSize: "100px 100px, 100px 100px",
          padding: "2rem",
        }}
        id="info-quest"
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
          <div id="sub-quests">
            <QuestList
              quests={nonFinishedSubQuests}
              finishedQuests={finishedSubQuests}
              name="TÂCHES"
            />
          </div>
        )}
      </section>

      {!quest.secondary && (
        <section
          id="glyph-quest"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
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
                glyphCheck?.length || GLYPH_MAX_SIZE,
                glyphCheck?.[0]?.length || GLYPH_MAX_SIZE,
              ]}
            />
          )}
        </section>
      )}
    </div>
  );
}
