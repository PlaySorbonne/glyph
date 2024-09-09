"use server";

import prisma from "@/lib/db";
import { Code, Quest } from "@prisma/client";
import {
  questSchema,
  QuestInput,
  codeFormat,
  codeSchema,
} from "@/utils/constants";

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

export async function createQuest(data: QuestInput, code?: string) {
  const validatedData = questSchema.safeParse(data);
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

export async function getAvailableQuests(userId: string) {
  return await prisma.quest.findMany({
    where: {
      ...dateCheck,
      History: {
        none: {
          userId: userId,
        },
      },
    },
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

/* get quests that are recently active */
export async function getRecenltyActiveQuests() {
  const nbDays = 3;
  return await prisma.quest.findMany({
    where: {
      starts: {
        lte: new Date(),
        gte: new Date(new Date().getTime() - nbDays * 24 * 60 * 60 * 1000),
      },
    },
  });
}

export async function getAvailablePrimaryQuests(userId?: string) {
  return await prisma.quest.findMany({
    where: {
      secondary: false,
      ...dateCheck,
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
      ...dateCheck,
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

export async function getFinishedSecondaryQuests(userId?: string) {
  return await prisma.quest.findMany({
    where: {
      secondary: true,
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

export async function getPrimaryQuests() {
  return await prisma.quest.findMany({
    where: {
      secondary: false,
      ...dateCheck,
    },
  });
}

export async function getFinishedPrimaryQuests(userId?: string) {
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

let dateCheck = {
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
