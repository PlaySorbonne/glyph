"use client";

import { useState } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
import TutoBtn from "../../components/TutoBtn";

import dynamic from "next/dynamic";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const steps: Step[] = [
  {
    target: "body",
    content: (<p>Bienvue dans la quête du héro !</p>),
    placement: "center"
  },
  {
    target: "#title-quest",
    content: (<p>La quête du héros est la première étape de votre aventure.</p>)
  },
  {
    target: "#info-quest",
    content: (<p>Vous trouverez ici toutes les informations nécessaires pour accomplir votre mission.</p>)
  },
  {
    target: "#glyph-quest",
    content: (<p>Pour accomplir votre quête, vous devez collecter des fragments de glyphes pour les assembler et trouver le glyph final.</p>)
  },
  {
    target: "#glyph-quest",
    content: (<p>Le fragment de la quête du héros est un élément clé pour progresser dans l'histoire. Il peut être trouvé sur une de nos affiches.</p>)
  }
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
      <Joyride steps={steps} run={run} callback={handleJoyrideCallback} />
    </>
  );
}
