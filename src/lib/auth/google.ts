import { generateSession } from "@/utils";
import prisma from "../db";
import { SESSION_TTL } from "@/utils/constants";

export const googleCallback = "/api/auth/google";

export type googleSignInData = { type: "google"; code?: string | null };

export async function signInWithGoogle(data: googleSignInData): Promise<{
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

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: data.code,
      client_id: process.env.AUTH_GOOGLE_ID ?? "",
      client_secret: process.env.AUTH_GOOGLE_SECRET ?? "",
      redirect_uri: `${process.env.MAIN_URL}${googleCallback}`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return {
      error: true,
      msg: "Invalid code",
    };
  }

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return {
      error: true,
      msg: "Invalid token response",
    };
  }

  const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userInfoResponse.ok) {
    return {
      error: true,
      msg: "Failed to fetch user info",
    };
  }

  const googleInfo = await userInfoResponse.json();

  if (!googleInfo.email) {
    return {
      error: true,
      msg: "Email not provided",
    };
  }

  let [account] = await prisma.account.findMany({
    where: {
      provider: "google",
      providerID: googleInfo.id,
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    if (!googleInfo.verified_email) {
      return {
        error: true,
        msg: "Email not verified, can't register",
      };
    }

    let [user] = await prisma.user.findMany({
      where: {
        email: googleInfo.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleInfo.email,
          emailVerified: googleInfo.verified_email,
        },
      });
    }

    account = await prisma.account.create({
      data: {
        provider: "google",
        providerID: googleInfo.id,
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