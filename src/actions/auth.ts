"use server";

import prisma from "@/lib/db";

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
