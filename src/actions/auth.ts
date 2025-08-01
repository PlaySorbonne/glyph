"use server";

import prisma from "@/lib/db";
import { appUrl } from "@/utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  return (await cookies()).get("session")?.value;
}

export async function logout(error: string | null) {
  if (!error) error = "Vous avez été déconnecté";
  let session = await getSession();

  try {
    await prisma.session.delete({
      where: {
        sessionToken: session,
      },
    });
  } catch (error) {
    console.error("Error deleting session", session);
  }

  const cookie = await cookies();
  cookie.delete("session");
  cookie.delete("name");
  cookie.delete("fraternityId");
  return redirect(appUrl("/login?error=" + error));
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
    await logout("La session n'existe pas");
  }

  if (!session) {
    return null;
  }

  return session.user;
}

export async function getHeaderUrl() {
  const headersList = await headers();
  return headersList.get("x-url") || "";
}
