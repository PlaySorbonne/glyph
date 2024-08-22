"use server";

import prisma from "@/lib/db";

export async function addFraternity(name: string) {
  return await prisma.fraternity.create({
    data: {
      name,
    },
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
  name: string,
) {
  return await prisma.fraternity.update({
    where: {
      id,
    },
    data: {
      name,
    },
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