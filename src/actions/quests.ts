"use server";

import prisma from "@/lib/db";
import { Code, Quest } from "@prisma/client";
import { questSchema, QuestInput } from "@/utils/constants";
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

export async function createQuest(data: QuestInput, withCode?: boolean) {
  const validatedData = questSchema.parse(data);

  return await prisma.quest.create({
    data: validatedData,
    include: {
      Code: withCode
        ? {
            code: generateCode(),
            isQuest: true,
          }
        : undefined,
    },
  });
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
