import Link from "next/link";

interface Quest {
  id: number;
  title: string;
  ends?: Date | null;
  starts?: Date | null;
  clickable?: boolean;
  hidden?: boolean;
}

function LinkOrDiv({
  children,
  style,
  isClickable,
  questId,
}: {
  children: React.ReactNode;
  style: React.CSSProperties;
  isClickable: boolean;
  questId: number;
}) {
  if (isClickable) {
    return (
      <Link href={`/app/quest/${questId}`} style={style}>
        {children}
      </Link>
    );
  }
  return <div style={style}>{children}</div>;
}

export default function QuestList({
  quests,
  unavailableQuests,
  finishedQuests,
  name,
}: {
  quests: Quest[];
  unavailableQuests?: Quest[];
  finishedQuests?: Quest[];
  name?: string;
}) {
  if (
    (!quests || quests.length === 0) &&
    (!finishedQuests || finishedQuests.length === 0) &&
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
          <QuestCard key={quest.id} quest={quest} />
        ))}
        {unavailableQuests &&
          unavailableQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={{ ...quest, clickable: false }}
              isUnavailable
            />
          ))}
        {finishedQuests &&
          finishedQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} isFinished />
          ))}
      </div>
    </div>
  );
}

function QuestCard({
  quest,
  isUnavailable,
  isFinished,
}: {
  quest: Quest;
  isUnavailable?: boolean;
  isFinished?: boolean;
}) {
  if (!quest) return null;

  return (
    <LinkOrDiv
      isClickable={Boolean(quest.clickable && !isUnavailable)}
      questId={quest.id}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        margin: "0.5rem 0",
        padding: "1rem",
        border: "1px solid #000",
      }}
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
        {!isUnavailable
          ? quest.title
          : Array.from(
              { length: 4 + Math.floor(Math.random() * 9) },
              () => "█"
            ).join("")}
      </h1>
      <p
        style={{
          textDecoration: "underline",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {isUnavailable && quest.starts
          ? `À partir du ${quest.starts.toLocaleDateString("fr-FR", {
              month: "numeric",
              day: "numeric",
            })}`
          : quest.clickable && !isUnavailable
          ? "PLUS DE DÉTAILS"
          : isFinished
          ? "TERMINE"
          : ""}
      </p>
    </LinkOrDiv>
  );
}
