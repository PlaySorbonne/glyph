"use server";

import prisma from "@/lib/db";
import { UserInput, userSchema } from "@/utils/constants";
import { getUserFromSession } from './auth';

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
    console.error('Validation error:', validatedData.error);
    throw new Error('Invalid user data');
  }
  return await prisma.user.create({
    data: validatedData.data,
  });
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  console.log
  const validatedData = userSchema.partial().safeParse(data);
  if (!validatedData.success) {
    console.error('Validation error:', validatedData.error);
    throw new Error('Invalid user data');
  }
  if (validatedData.data.isAdmin) {
    let user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        accounts: true,
      }
    });
    let hasProvider = user?.accounts?.length ?? 0 > 0;
    if (!hasProvider) {
      console.warn('User has no provider, cannot update isAdmin');
    }
    // let emailVerified = user?.emailVerified ?? false;
    data.isAdmin = Boolean(hasProvider);
  }
  return await prisma.user.update({
    where: {
      id,
    },
    data: validatedData.data,
  });
}

export async function addUsername(id: string, username: string) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: username,
    },
  });
}

export async function updateUserSelf(sessionId: string, data: Partial<UserInput>) {
  const user = await getUserFromSession(sessionId);
  if (!user) {
    throw new Error('User not authenticated');
  }

  const validatedData = userSchema.partial().safeParse(data);
  if (!validatedData.success) {
    console.error('Validation error:', validatedData.error);
    throw new Error('Invalid user data');
  }

  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedData.data,
  });
}

export async function updateUserWelcomed(sessionId: string) {
  const user = await getUserFromSession(sessionId);
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await prisma.user.update({
    where: {
      id: user.id,
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