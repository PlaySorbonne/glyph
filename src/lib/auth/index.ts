import prisma from "../db";
import { generateSession } from "@/utils";
import { SESSION_TTL } from "@/utils/constants";
import { useRouter } from 'next/navigation'



export default {};

type outData = { name: string; session: string };
type signInData = nameSignInData | discordSignInData;

export async function signIn(data: signInData) {
  if (data.type === "name") {
    return signInWithName(data);
  }
  if (data.type === "discord") {
    return signInWithDiscord(data);
  }
}

type nameSignInData = { name: string; type: "name" };
async function signInWithName(data: nameSignInData): Promise<outData | null> {
  let [user, ..._] = await prisma.user.findMany({
    where: {
      name: data.name,
    },
    include: {
      accounts: true,
    },
  });

  // Register
  if (!user) {
    let newUser = await prisma.user.create({
      data: {
        name: data.name,
      },
    });
    let session = await prisma.session.create({
      data: {
        userId: newUser.id,
        sessionToken: generateSession(newUser.id),
        expires:
          SESSION_TTL === -1
            ? new Date(2147483647000)
            : new Date(Date.now() + SESSION_TTL),
      },
    });
    return {
      name: data.name,
      session: session.sessionToken,
    }
  }

  if (user.accounts.length > 0) {
    return null
  }

  let session = await prisma.session.create({
    data: {
      userId: user.id,
      sessionToken: generateSession(user.id),
      expires:
        SESSION_TTL === -1
          ? new Date(2147483647000)
          : new Date(Date.now() + SESSION_TTL),
    },
  });
  return {
    name: data.name,
    session: session.sessionToken
  }
}

export const discordCallback = "/api/auth/discord";
type discordSignInData = { type: "discord"; code?: string | null };
async function signInWithDiscord(data: discordSignInData): Promise<outData | null> {
  if (!data.code) {
    return null;
  }

  let res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.AUTH_DISCORD_ID ?? "",
      client_secret: process.env.AUTH_DISCORD_SECRET ?? "",
      code: data.code,
      grant_type: "authorization_code",
      redirect_uri: `${process.env.MAIN_URL}${discordCallback}`,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  
  let json = await res.json();
  
  if (!res.ok || json.error) {
    return null
  }
  
  let userRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${json.access_token}`,
    },
  });

  let user = await userRes.json();
  console.log("user", user);
  
/*   interface user {
    id: 'number',
    username: 'username',
    email: 'email',
    verified: boolean
  } */
  
  

  
  return {
    name: "test",
    session: "test",
  }
}
