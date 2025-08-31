"use client";

import { NB_MAIN_QUESTS } from "@/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Quest {
  id: number;
  title: string;
  description?: string | null;
  mission?: string | null;
}

export default function MainQuestSlider({
  quests,
  offset = 0,
}: {
  quests: Quest[];
  offset?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i < quests.length - 1 ? i + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [quests.length]);

  if (!quests || quests.length === 0) return null;
  if (quests.length === 1) return <QuestCard nb={offset + 1} quest={quests[0]} />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quests[index]?.id}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <QuestCard nb={offset + index + 1} quest={quests[index]} />
      </motion.div>
    </AnimatePresence>
  );
}

function QuestCard({ nb, quest }: { nb: number; quest: Quest }) {
  if (!quest) return null;

  return (
    <Link href={`/app/quest/${quest.id}`}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
          }}
        >
          QUÊTE PRINCIPALE: {quest.title}
        </h1>
        <h1>
          {nb}/{NB_MAIN_QUESTS}
        </h1>
      </div>
      <p
        style={{
          paddingLeft: "1rem",
          paddingTop: "1rem",
          height: "min(10vh, 150px)",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {quest.mission}
      </p>
      <p
        style={{
          width: "100%",
          textAlign: "right",
          textDecoration: "underline",
          fontWeight: "600",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        PLUS DE DETAILS
      </p>
    </Link>
  );
}
