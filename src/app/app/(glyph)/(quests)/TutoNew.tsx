"use client";

import { useEffect, useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";

import dynamic from "next/dynamic";
import TutoBtn from "../components/TutoBtn";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const steps: Step[] = [
  {
    target: "body",
    content: (
      <p style={{ textAlign: "left" }}>
        Bienvenue sur l'interface de glyph ! Actuellement tu es sur le menu
        principal où tu pourras trouver un aperçu de toutes tes quêtes.
      </p>
    ),
    placement: "center",
  },
  {
    target: "#main-quests-section",
    content: "Cliquez ici pour compléter la quête principale",
  },
];

export default function TutoNew() {
  const [run, setRun] = useState(false);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <>
      <TutoBtn
        onClick={(e) => {
          e.stopPropagation();
          setRun(true);
        }}
      />
      <Joyride
        steps={steps}
        run={run}
        continuous
        showSkipButton
        callback={handleJoyrideCallback}
        spotlightClicks
      />
    </>
  );
}
