import { discordSignInData, signInWithDiscord } from "./discord";
import { nameSignInData, signInWithName } from "./username";
import { googleSignInData, signInWithGoogle } from "./google";
import { cookies } from "next/headers";
import { SESSION_TTL } from "@/utils/constants";
import { User } from "@prisma/client";
import { getCode, userScannedCode } from "@/actions/code";

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

  if (!out?.error) {
    let ttl =
      SESSION_TTL === -1
        ? new Date(2147483647000)
        : new Date(Date.now() + SESSION_TTL);
    cookies().set("session", out.session, {
      expires: ttl,
    });
    if (out.name) {
      cookies().set("name", out.name, {
        expires: ttl,
      });
    }
  }

  if (out.error || !out.registered) return out;

  try {
    let code = await getCode("notwelcome");
    if (!code) {
      console.error("Quests not initialized yet");
      throw new Error("Quests not initialized yet");
    }
    userScannedCode(out.user, code!);
  } catch (e: any) {}

  return out;
}

export async function register(data: signInData): Promise<
  | {
      error: true;
      msg: string;
    }
  | {
      error: false;
      session: string;
      name?: string | null;
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
  } else if (data.type === "name") {
    out = await signInWithName(data);
  } else {
    return {
      error: true,
      msg: "Invalid sign in type",
    };
  }

  if (!out?.error) {
    let ttl =
      SESSION_TTL === -1
        ? new Date(2147483647000)
        : new Date(Date.now() + SESSION_TTL);
    cookies().set("session", out.session, {
      expires: ttl,
    });
    if (out.name) {
      cookies().set("name", out.name, {
        expires: ttl,
      });
    }
  }

  return out;
}
