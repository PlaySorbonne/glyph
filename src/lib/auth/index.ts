"use server";

import { discordSignInData, signInWithDiscord } from "./discord";
import { nameSignInData, signInWithName } from "./username";
import { googleSignInData, signInWithGoogle } from "./google";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import prisma from "../db";
import { SESSION_TTL } from "@/utils";

type signInData = nameSignInData | discordSignInData | googleSignInData;

export async function signIn(data: signInData): Promise<
  | {
      error: true;
      msg: string;
    }
  | {
      error: false;
      session: string;
      name?: string | null;
      registered: boolean;
      user: User;
    }
> {
  if (process.env.DISABLE_LOGIN && data.type !== "google")
    return {
      error: true,
      msg: "Login is disabled",
    };

  let out;
  if (data.type === "discord") {
    out = await signInWithDiscord(data);
  } else if (data.type === "google") {
    out = await signInWithGoogle(data);
    // prevent login in function, it allows @playsorbonne.fr emails only
  } else if (data.type === "name") {
    out = await signInWithName(data);
  } else {
    return {
      error: true,
      msg: "Invalid sign in type",
    };
  }

  let cookie = await cookies();

  if (out.error || !out.registered) return out;

  let ttl =
    SESSION_TTL === -1
      ? new Date(2147483647000)
      : new Date(Date.now() + SESSION_TTL);

  cookie.set("session", out.session, {
    expires: ttl,
  });

  if (out.user.fraternityId)
    cookie.set("fraternityId", out.user.fraternityId.toString(), {
      expires: ttl,
    });

  if (out.name)
    cookie.set("name", out.name, {
      expires: ttl,
    });

  try {
    let code = await prisma.code.findFirst({
      where: {
        code: "notwelcome",
      },
      include: {
        quest: true,
      },
    });

    if (!code || !code.quest) {
      console.warn("WARNING: Pas de quête associé au code notwelcome.");
      return out;
    }

    await prisma.history.create({
      data: {
        userId: out.user.id,
        questId: code.quest.id,
        codeId: code.id,
        points: code.quest.points,
      },
    });
  } catch (e: any) {
    console.error(e);
  }

  return out;
}