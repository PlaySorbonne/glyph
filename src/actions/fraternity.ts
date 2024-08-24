"use server";

import prisma from "@/lib/db";
import { fraternitySchema } from "@/utils/constants";

export async function addFraternity(data: {
  name: string;
  description?: string;
}) {
  const parsedData = fraternitySchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Invalid data");
  }

  return await prisma.fraternity.create({
    data: parsedData.data,
  });
}

export async function getFraternity(id: number) {
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
  const parsedData = fraternitySchema.safeParse(data);
  if (!parsedData.success) {
    throw new Error("Invalid data");
  }
  return await prisma.fraternity.update({
    where: {
      id,
    },
    data: parsedData.data,
  });
}

// Aucune idée de si ça marche
export async function recalculateScore() {
  const fraternities = await prisma.fraternity.findMany();
  for (const fraternity of fraternities) {
    const score = await prisma.user.aggregate({
      where: {
        fraternityId: fraternity.id,
      },
      _sum: {
        score: true,
      },
    });
    await prisma.fraternity.update({
      where: {
        id: fraternity.id,
      },
      data: {
        score: score._sum.score || 0,
      },
    });
  }
}

export async function getClassement() {
  return await prisma.fraternity.findMany({
    orderBy: {
      score: "desc",
    },
  });
}

export async function getFraternityMembers(fraternityId: number) {
  return await prisma.user.findMany({
    where: {
      fraternityId,
    },
  });
}

export async function getFraternityMembersCount(fraternityId: number) {
  return await prisma.user.count({
    where: {
      fraternityId,
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
  let membersCount = await getFraternitysMembersCount();
  console.log(membersCount);
  membersCount.sort((a, b) => a._count - b._count);
  return membersCount[0].fraternityId;
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