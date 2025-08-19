"use client";

import Link from "next/link";

interface Quest {
  id: number;
  title: string;
  ends?: Date | null;
  starts?: Date | null;
}

export default function QuestList({
  quests,
  unavailableQuests,
  finishedQuests,
  name,
  clickable = true,
}: {
  quests: Quest[];
  unavailableQuests?: Quest[];
  finishedQuests?: Quest[];
  name?: string;
  clickable?: boolean;
}) {
  if (
    (!quests || quests.length === 0) &&
    (!unavailableQuests || unavailableQuests.length === 0)
  )
    return null;
  if (!name) name = "QUÊTES SECONDAIRES";
  name = name.toUpperCase();

  return (
    <div>
      <h1
        style={{
          fontWeight: "bold",
        }}
      >
        {name} :
      </h1>
      <div
        style={{
          padding: "0 1rem",
        }}
      >
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} clickable={clickable} />
        ))}
        {unavailableQuests &&
          unavailableQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isUnavailable
              clickable={false}
            />
          ))}
        {finishedQuests &&
          finishedQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isFinished
              clickable={false}
            />
          ))}
      </div>
    </div>
  );
}

function QuestCard({
  quest,
  isUnavailable,
  clickable,
  isFinished,
}: {
  quest: Quest;
  isUnavailable?: boolean;
  clickable?: boolean;
  isFinished?: boolean;
}) {
  if (!quest) return null;

  return (
    <Link
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        margin: "0.5rem 0",
        padding: "1rem",
        border: "1px solid #000",
        cursor: clickable ? "pointer" : "default",
      }}
      href={clickable && !isUnavailable ? `/app/quest/${quest.id}` : ""}
    >
      <h1
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginRight: "1rem",
          flex: "1",
        }}
      >
        {quest.title}
      </h1>
      <p
        style={{
          textDecoration: "underline",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {isUnavailable
          ? `À partir du ${quest.starts!.toLocaleDateString("fr-FR", {
              month: "numeric",
              day: "numeric",
            })}`
          : clickable
          ? "PLUS DE DÉTAILS"
          : isFinished
          ? "TERMINE"
          : ""}
      </p>
    </Link>
  );
}
