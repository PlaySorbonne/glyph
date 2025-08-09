"use client";

import { getAvailableMainQuests } from "@/actions/quests";
import { NB_MAIN_QUESTS } from "@/utils";
import { Quest } from "@prisma/client";
import icons from "@/assets/icons";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function MainQuestSlider({quests}: { quests: Quest[] }) {

  // Render client-side slider
  return <Slider quests={quests} />;
}

// Client component for slider
function Slider({ quests }: { quests: Quest[] }) {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i > 0 ? i - 1 : quests.length - 1));
  }
  function next() {
    setIndex((i) => (i < quests.length - 1 ? i + 1 : 0));
  }

  return (
    <div
      style={{
        backgroundImage: `url(${icons.corner.src}), url(${icons.corner.src})`,
        backgroundRepeat: "no-repeat, no-repeat",
        backgroundPosition: "top right, bottom left",
        backgroundSize: "100px 100px, 100px 100px",
        position: "relative",
      }}
    >
      <button
        type="button"
        onClick={prev}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        ◀
      </button>
      <QuestCard nb={index + 1} quest={quests[index]} />
      <button
        type="button"
        onClick={next}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        ▶
      </button>
    </div>
  );
}

function QuestCard({ nb, quest }: { nb: number; quest: Quest }) {
  return (
    <Link
      style={{
        padding: "1rem 1.5rem",
      }}
      href={`/app/quest/${quest.id}`}
    >
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
        }}
      >
        {quest.mission}
      </p>
      <p style={{
        width: "100%",
        textAlign: "right",
        textDecoration: "underline",
        fontWeight: "600"
      }}>
        PLUS DE DETAILS
      </p>
    </Link>
  );
}
