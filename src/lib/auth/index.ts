import { discordSignInData, signInWithDiscord } from "./discord";
import { nameSignInData, signInWithName } from "./username";
import { googleSignInData, signInWithGoogle } from "./google";

type signInData = nameSignInData | discordSignInData | googleSignInData;

export async function signIn(data: signInData) {
  if (data.type === "discord") {
    return signInWithDiscord(data);
  } else if (data.type === "google") {
    return signInWithGoogle(data);
  }

  return signInWithName(data);
}

export * from "../../actions/auth";