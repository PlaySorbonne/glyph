import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { getUserFromSession } from "@/actions/auth";
import { getLogo, getName } from "@/assets/fraternities";
import Image from "next/image";
import { getFinishedPrimaryQuests, getQuests } from "@/actions/quests";

export default async function Header() {
  let user = await getUserFromSession();
  let fraternityId = user!.fraternityId! as 1 | 2 | 3;
  let fraternity = getLogo(fraternityId);
  let finishedQuests = await getFinishedPrimaryQuests(user!.id);
  let quests = await getQuests();
  let primaryQuests = quests.filter((quest) => !quest.secondary);

  return (
    <header className={styles.header}>
      <Image
        src={fraternity}
        alt={getName(user!.fraternityId)}
        width={70}
        height={70}
      />
      <div
        style={{
          width: "80%",
        }}
      >
        <h1
          style={{
            padding: "0",
            margin: "0",
            color: `rgb(${colors[fraternityId]})`,
          }}
        >
          {user!.name}
        </h1>
        <p
          style={{
            padding: "0",
            margin: "0",
          }}
        >
          {user!.score} points
        </p>
        <div
          style={{
            width: "100%",
            height: "10px",
            outline: "1px solid black",
          }}
        >
          <div
            style={{
              width: `${(finishedQuests.length / primaryQuests.length) * 100 + 2}%`,
              height: "100%",
              backgroundColor: `rgb(${colors[fraternityId]})`,
            }}
          />
        </div>
      </div>
      <p>{finishedQuests.length / primaryQuests.length * 100}%</p>
    </header>
  );
}

let colors = {
  1: "240,166,0",
  2: "200,51,88",
  3: "40,121,101",
};
