import { generateSession } from "@/utils";
import prisma from "../db";
import { SESSION_TTL } from "@/utils/constants";

export const discordCallback = "/api/auth/discord";

export type discordSignInData = { type: "discord"; code?: string | null };

export async function signInWithDiscord(data: discordSignInData): Promise<{
  error: true;
  msg: string;
} | {
  error: false;
  name: string | null;
  session: string;
}> {
  if (!data.code) {
    return {
      error: true,
      msg: "No code provided",
    };
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

  if (!res.ok) {
    return {
      error: true,
      msg: "Invalid code",
    };
  }

  let json = await res.json();

  if (json.error || !json.access_token) {
    return {
      error: true,
      msg: "Invalid code",
    };
  }

  let userRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${json.access_token}`,
    },
  });

  if (!userRes.ok) {
    return {
      error: true,
      msg: "Invalid code",
    };
  }

  let discordInfo = await userRes.json();

  if (discordInfo.error) {
    return {
      error: true,
      msg: "Invalid code",
    };
  }

  // Check if user is already registered
  let [account, ..._] = await prisma.account.findMany({
    where: {
      provider: "discord",
      providerID: discordInfo.id,
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    if (discordInfo.verified === false || !discordInfo.email) {
      return {
        error: true,
        msg: "Email not verified",
      };
    }

    let [user, ..._] = await prisma.user.findMany({
      where: {
        email: discordInfo.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: discordInfo.email,
          emailVerified: discordInfo.verified,
        },
      });
    }

    account = await prisma.account.create({
      data: {
        provider: "discord",
        providerID: discordInfo.id,
        userId: user.id,
      },
      include: {
        user: true,
      },
    });
  }

  let session = await prisma.session.create({
    data: {
      userId: account.userId,
      sessionToken: generateSession(account.userId),
      expires:
        SESSION_TTL === -1
          ? new Date(2147483647000)
          : new Date(Date.now() + SESSION_TTL),
    },
    include: {
      user: true,
    },
  });

  return {
    error: false,
    name: session.user.name,
    session: session.sessionToken,
  };
}
