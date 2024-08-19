import { discordSignInData, signInWithDiscord } from "./discord";
import { nameSignInData, signInWithName } from "./username";


type signInData = nameSignInData | discordSignInData;

export async function signIn(data: signInData) {
  if (data.type === "discord") {
    return signInWithDiscord(data);
  }

  return signInWithName(data);
}
