"use server";

import prisma from "@/lib/db";
import { historySchema } from "@/utils/zod";
import { History } from "@prisma/client";

export async function getHistoryById(id: number) {
  return await prisma.history.findFirst({
    where: {
      id,
    },
  });
}

export async function updateHistory(id: number, data: Partial<History>) {
  let dataParsed = historySchema.partial().safeParse(data);

  if (!dataParsed.success) {
    throw new Error("Invalid data");
  }

  return await prisma.history.update({
    where: {
      id,
    },
    data: dataParsed.data,
  });
}

export async function deleteHistory(id: number) {
  return await prisma.history.delete({
    where: {
      id,
    },
  });
}

export async function getHistories(n?: number) {
  return await prisma.history.findMany({
    orderBy: {
      date: "desc",
    },
    take: n,
  });
}

export async function getHistoryByCodeId(codeId: number) {
  return await prisma.history.findMany({
    where: {
      codeId,
    },
  });
}

export async function getHistoryByQuestId(questId: number, userId: string) {
  return await prisma.history.findFirst({
    where: {
      questId,
      userId,
    },
  });
}
