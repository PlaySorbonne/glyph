"use server";

import prisma from "@/lib/db";
import { Code, Quest } from "@prisma/client";
import {
  questSchema,
  QuestInput,
  codeFormat,
  codeSchema,
} from "@/utils/constants";
import { generateCode } from "@/utils";

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
  console.log(`"${code}"`);
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
    },
    include: {
      hasFinished: {
        where: {
          NOT: {
            userId: userId,
          },
        },
      },
    },
  });
}

export async function getFinishedQuests(userId: string) {
  return await prisma.quest.findMany({
    where: {
      hasFinished: {
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

// récupère les quêtes créées aujourd'hui (après minuit)
export async function getNewlyCreatedQuests() {
  let dateToday = new Date();
  dateToday.setHours(0, 0, 0, 0);
  return await prisma.quest.findMany({
    where: {
      createdAt: {
        gt: dateToday,
      },
      secondary: true,
    },
  });
}
