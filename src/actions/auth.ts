"use server";

import prisma from "@/lib/db";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return cookies().get("session")?.value;
}

export async function logout(error: string = "Vous avez été déconnecté") {
  let session = await getSession();
  if (!session) {
    session = await getSession();
  }

  try {
    await prisma.session.delete({
      where: {
        sessionToken: session,
      },
    });
  } catch (error) {
    console.error("Error deleting session", session);
  }

  cookies().delete("session");
  return redirect(new URL("/login?error=" + error, process.env.MAIN_URL).toString());
}

export async function getUserFromSession(sessionId?: string) {
  if (!sessionId) sessionId = await getSession();
  if (!sessionId) return null;

  let session;
  try {
    session = await prisma.session.update({
      where: {
        sessionToken: sessionId,
        expires: { gt: new Date() },
      },
      data: {
        lastUsed: new Date(),
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("Error getting user from session", sessionId);
    return redirect(new URL("/logout?error=La session n'existe pas", process.env.MAIN_URL).toString());
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
