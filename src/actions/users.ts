"use server";

import prisma from "@/lib/db";
import { SESSION_TTL, UserInput, userSchema } from "@/utils/constants";
import { getUserFromSession } from "./auth";
import { cookies } from "next/headers";
import { Session } from "inspector";
import { isFraternityFull } from "./fraternity";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function getUserByName(name: string) {
  return await prisma.user.findUnique({
    where: {
      name,
    },
  });
}

export async function getUsers(data?: { n?: number; sortByPoint?: boolean }) {
  let { n, sortByPoint } = data || {};
  return await prisma.user.findMany({
    take: n,
    orderBy: [
      {
        score: sortByPoint ? "desc" : undefined,
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function createUser(data: UserInput) {
  const validatedData = userSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid user data");
  }
  return await prisma.user.create({
    data: validatedData.data,
  });
}

export async function updateUser(
  id: string,
  data: Partial<UserInput>,
  setCookie: boolean = false
) {
  const validatedData = userSchema.partial().safeParse(data);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid user data");
  }
  if (validatedData.data.isAdmin) {
    let user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      },
    });
    let hasProvider = user?.accounts?.length ?? 0 > 0;
    if (!hasProvider) {
      console.warn("User has no provider, cannot update isAdmin");
    }
    // let emailVerified = user?.emailVerified ?? false;
    data.isAdmin = Boolean(hasProvider);
  }
  let out = await prisma.user.update({
    where: {
      id,
    },
    data: validatedData.data,
  });

  if (setCookie) {
    let ttl =
      SESSION_TTL === -1
        ? new Date(2147483647000)
        : new Date(Date.now() + SESSION_TTL);
    cookies().set("userId", out.id, {
      expires: ttl,
    });
    if (out.name) {
      cookies().set("name", out.name, {
        expires: ttl,
      });
    }
  }
}

export async function addUsername(id: string, username: string) {
  let out = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: username,
    },
  });
  cookies().set("name", out.name!, {
    expires:
      SESSION_TTL === -1
        ? new Date(2147483647000)
        : new Date(Date.now() + SESSION_TTL),
  });
  return out;
}

export async function updateUserSelf(
  sessionId: string,
  data: Partial<UserInput>
) {
  const user = await getUserFromSession(sessionId);
  if (!user) {
    throw new Error("User not authenticated");
  }

  const validatedData = userSchema.partial().safeParse(data);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid user data");
  }

  let out = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedData.data,
  });

  let ttl =
    SESSION_TTL === -1
      ? new Date(2147483647000)
      : new Date(Date.now() + SESSION_TTL);
  cookies().set("session", sessionId, {
    expires: ttl,
  });
  if (out.name) {
    cookies().set("name", out.name!, {
      expires: ttl,
    });
  }

  return out;
}

export async function updateUserWelcomed({
  userId = undefined,
  sessionToken = undefined,
}:
  | { userId: string; sessionToken: undefined }
  | { sessionToken: string; userId: undefined }) {
  if (!userId && !sessionToken) {
    throw new Error("Invalid session data");
  }

  if (!userId) {
    userId = (await getUserFromSession(sessionToken))?.id;
  }

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      welcomed: true,
    },
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}

export async function joinFraternity(
  userId: string,
  fraternityId: number,
  force: boolean = false
) {
  if (!force && (await isFraternityFull(fraternityId))) {
    throw new Error("Fraternity is full");
  }
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      fraternityId,
    },
  });
}
