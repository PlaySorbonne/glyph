"use client";

import { getAvailableMainQuests } from "@/actions/quests";
import { NB_MAIN_QUESTS } from "@/utils";
import { Quest } from "@prisma/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function MainQuestSlider({ quests }: { quests: Quest[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i < quests.length - 1 ? i + 1 : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, [quests.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quests[index].id}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <QuestCard
          nb={index + 1}
          quest={quests[index]}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function QuestCard({ nb, quest }: { nb: number; quest: Quest }) {
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
