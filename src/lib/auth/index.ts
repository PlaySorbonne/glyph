import { discordSignInData, signInWithDiscord } from "./discord";
import { nameSignInData, signInWithName } from "./username";
import { googleSignInData, signInWithGoogle } from "./google";
import { cookies } from "next/headers";
import { SESSION_TTL } from "@/utils/constants";
import { User } from "@prisma/client";

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
  let out;
  if (data.type === "discord") {
    if (process.env.DISABLE_LOGIN)
      return {
        error: true,
        msg: "Login is disabled",
      };
    out = await signInWithDiscord(data);
  } else if (data.type === "google") {
    out = await signInWithGoogle(data);
    // prevent login in function, it allows @playsorbonne.fr emails only
  } else if (data.type === "name") {
    if (process.env.DISABLE_LOGIN)
      return {
        error: true,
        msg: "Login is disabled",
      };
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
