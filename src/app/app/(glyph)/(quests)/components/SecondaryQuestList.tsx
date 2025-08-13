"use client";

import { Quest } from "@prisma/client";
import Link from "next/link";

export default function SecondaryQuestList({ quests }: { quests: Quest[] }) {
  return (
    <div>
      <h1
        style={{
          fontWeight: "bold",
        }}
      >
        QUÊTES SECONDAIRES :
      </h1>
      <div style={{
        padding: "0 1rem"
      }}>
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}

function QuestCard({ quest }: { quest: Quest }) {
  return (
    <Link
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#ffe",
        margin: "0.5rem 0",
        padding: "1rem",
        border: "1px solid #000",
      }}
      href={`/app/quest/${quest.id}`}
    >
      <h1>{quest.title}</h1>
      <p
        style={{
          textDecoration: "underline",
          fontWeight: "bold",
        }}
      >
        PLUS DE DÉTAILS
      </p>
    </Link>
  );
}
