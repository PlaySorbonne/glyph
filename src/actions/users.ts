"use server";

import prisma from "@/lib/db";
import { UserInput, userSchema } from "@/utils/constants";

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

export async function getUsers(n?: number) {
  return await prisma.user.findMany({
    take: n,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createUser(data: UserInput) {
  const validatedData = userSchema.parse(data);

  return await prisma.user.create({
    data: validatedData,
  });
}

export async function updateUser(id: string, data: UserInput) {
  const validatedData = userSchema.parse(data);

  return await prisma.user.update({
    where: {
      id,
    },
    data: validatedData,
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
