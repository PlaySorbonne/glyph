"use server";

import prisma from "@/lib/db";
import { fraternitySchema } from "@/utils/zod";
import { randomInt } from "crypto";

export async function createDefaultFraternitys() {
  await prisma.fraternity.createMany({
    data: [
      {
        id: 1,
        name: "Pietr",
        description: "",
      },
      {
        id: 2,
        name: "Saka",
        description: "",
      },
      {
        id: 3,
        name: "Foli",
        description: "",
      },
    ],
  });
}

export async function getFraternity(id?: number | null) {
  if (!id) {
    return null;
  }
  return await prisma.fraternity.findUnique({
    where: {
      id,
    },
  });
}

export async function updateFraternity(
  id: number,
  data: { name: string; description?: string }
) {
  const parsedData = fraternitySchema.partial().safeParse(data);
  if (!parsedData.success) {
    throw new Error("Invalid data");
  }

  let fraternity = await prisma.fraternity.findUnique({
    where: {
      id,
    },
    include: {
      users: true,
    },
  });

  let score = fraternity?.users.reduce((acc, user) => acc + user.score, 0) || 0;

  return await prisma.fraternity.update({
    where: {
      id,
    },
    data: { ...parsedData.data, score },
  });
}

export async function getClassement() {
  return await prisma.fraternity.findMany({
    orderBy: {
      score: "desc",
    },
  });
}

export async function getFraternitysMembersCount() {
  return await prisma.user.groupBy({
    by: ["fraternityId"],
    _count: true,
  });
}

export async function getNextAvailableFraternity() {
  let membersCount: { _count: number; fraternityId: number | null }[] = [
    { _count: 0, fraternityId: 1 },
    { _count: 0, fraternityId: 2 },
    { _count: 0, fraternityId: 3 },
  ];
  membersCount = [...(await getFraternitysMembersCount()), ...membersCount];
  membersCount = membersCount.filter(
    (a, b, c) => c.findIndex((t) => t.fraternityId === a.fraternityId) === b
  );
  membersCount = membersCount.sort((a, b) => a._count - b._count);
  membersCount = membersCount.filter((a) => a.fraternityId);
  if (membersCount.length === 0) {
    return randomInt(1, 3);
  }
  return membersCount[0].fraternityId!;
}

export async function isFraternityFull(fraternityId: number) {
  let membersCount = await getFraternitysMembersCount();
  membersCount.sort((a, b) => a._count - b._count);
  return membersCount[0].fraternityId !== fraternityId;
}

export async function getFraternitysWithMembersCount() {
  return await prisma.fraternity.findMany({
    include: {
      _count: true,
    },
  });
}
