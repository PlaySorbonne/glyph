"use server";

import prisma from "@/lib/db";
import { cookies, headers } from "next/headers";

export async function getSession() {
  return cookies().get("session")?.value;
}

export async function logout(session?: string) {
  if (!session) {
    session = await getSession();
  }

  if (!session) {
    cookies().delete("session");
    return;
  }

  await prisma.session.delete({
    where: {
      sessionToken: session,
    },
  });
  cookies().delete("session");
}

export async function getUserFromSession(sessionId: string | undefined) {
  if (!sessionId) return null;

  let session;
  try {
    session = await prisma.session.update({
      where: {
        sessionToken: sessionId,
      },
      data: {
        lastUsed: new Date(),
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("Error updating session:", error);
    return null;
  }

  if (!session) {
    return null;
  }

  return session.user;
}

export async function getHeaderUrl() {
  const headersList = headers();
  return headersList.get("x-url") || "";
}
