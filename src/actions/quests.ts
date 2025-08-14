"use server";

import prisma from "@/lib/db";
import { Code, Quest, User } from "@prisma/client";
import {
  normalQuestSchema,
  NormalQuestInput,
  codeFormat,
  codeSchema,
} from "@/utils/zod";

function dateCheck() {
  return {
    OR: [
      {
        starts: {
          equals: null,
        },
        ends: {
          equals: null,
        },
      },
      {
        starts: {
          lte: new Date(),
        },
        ends: {
          gte: new Date(),
        },
      },
      {
        starts: {
          equals: null,
        },
        ends: {
          gte: new Date(),
        },
      },
      {
        starts: {
          lte: new Date(),
        },
        ends: {
          equals: null,
        },
      },
    ],
  };
}

export async function getQuests(n?: number): Promise<Quest[]> {
  return await prisma.quest.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: n,
  });
}

export async function getQuest(id: string) {
  return await prisma.quest.findUnique({
    where: {
      id: parseInt(id),
    },
  });
}

export async function createQuest(data: NormalQuestInput, code?: string) {
  const validatedData = normalQuestSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid quest data");
  }
  let parsedCode = codeFormat.optional().safeParse(code);
  if (!parsedCode.success) {
    console.error("Invalid code:", parsedCode.error);
    throw new Error("Invalid code");
  }

  const quest = await prisma.quest.create({
    data: validatedData.data,
  });

  if (code) {
    await prisma.code.create({
      data: {
        code: code,
        isQuest: true,
        questId: quest.id,
        points: quest.points,
        description: `${quest.title}`,
      },
    });
  }

  return quest;
}

export async function updateQuest(id: string, data: Partial<Quest>) {
  const existingQuest = await prisma.quest.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!existingQuest) {
    throw new Error("Quest not found");
  }

  const updatedData = {
    ...existingQuest,
    ...data,
  };

  return await prisma.quest.update({
    where: {
      id: parseInt(id),
    },
    data: updatedData,
  });
}

export async function getFinishedQuests(userId: string) {
  return await prisma.quest.findMany({
    where: {
      History: {
        some: {
          userId: userId,
        },
      },
    },
  });
}

export async function deleteQuest(id: string) {
  return await prisma.quest.delete({
    where: {
      id: parseInt(id),
    },
  });
}

export async function getAvailableMainQuests(userId?: string) {
  return await prisma.quest.findMany({
    where: {
      secondary: false,
      ...dateCheck(),
      History: userId
        ? {
            none: {
              userId: userId,
            },
          }
        : undefined,
    },
  });
}

export async function getAvailableSecondaryQuests(userId?: string) {
  return await prisma.quest.findMany({
    where: {
      secondary: true,
      ...dateCheck(),
      History: userId
        ? {
            none: {
              userId: userId,
            },
          }
        : undefined,
    },
    orderBy: [
      {
        starts: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getMainQuests() {
  return await prisma.quest.findMany({
    where: {
      secondary: false,
      ...dateCheck(),
    },
  });
}

export async function getFinishedMainQuests(userId?: string) {
  return await prisma.quest.findMany({
    where: {
      secondary: false,
      History: userId
        ? {
            some: {
              userId: userId,
            },
          }
        : undefined,
    },
  });
}

export async function hasUserFinishedQuest(userId: string, questId: number) {
  try {
    let history = await prisma.history.findFirst({
      where: {
        userId: userId,
        questId: questId,
      },
    });
    return history ? true : false;
  } catch (error) {
    console.error("Error checking if user has finished quest", error);
    return false;
  }
}


export async function getUnavailableMainQuests() {
  return await prisma.quest.findMany({
    where: {
      AND: [
        {
          NOT: dateCheck(),
        },
        {
          secondary: false,
        },
      ],
    },
  });
}

export async function getUnavailableSecondaryQuests(userId?: string) {
  return await prisma.quest.findMany({
    where: {
      AND: [
        {
          NOT: dateCheck(),
        },
        {
          secondary: true,
          History: userId
            ? {
                none: {
                  userId: userId,
                },
              }
            : undefined,
        },
      ],
    },
  });
}

export async function userValidatedQuest(user: User, quest: Quest) {
  if (process.env.NO_SCAN) {
    throw new Error("Le scan est désactivé");
  }

  let history = await prisma.history.findFirst({
    where: {
      userId: user.id,
      questId: quest.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (history) {
    throw new Error("La quête a déjà été validée");
  }

  const out = await prisma.history.create({
    data: {
      userId: user.id,
      questId: quest.id,
      points: quest.points,
      description: `Vous avez fini la quête principale ${quest.title} en trouvant le Glyph`,
    },
  });

  await prisma.fraternity.update({
    where: {
      id: user.fraternityId!,
    },
    data: {
      score: {
        increment: quest.points,
      },
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      score: {
        increment: quest.points,
      },
    },
  });

  return out;
}
