import prisma from "@/lib/db";
import { codeFormat, codeSchema } from "@/utils/constants";
import { Code } from "@prisma/client";

export async function addCodeToQuest(
  id: string,
  data: { code: string } & Partial<Code>
) {
  return await addCode({
    ...data,
    questId: parseInt(id),
    isQuest: true,
  });
}

export async function addCode(data: { code: string } & Partial<Code>) {
  const validatedData = codeSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid code data");
  }

  if (data.isQuest) {
    if (!data.questId) {
      throw new Error("Quest ID is required");
    }
    let quest = await prisma.quest.findUnique({
      where: {
        id: data.questId!,
      },
    });

    if (!quest) {
      throw new Error("Quest not found");
    }
    data.points = quest.points || 1;
  }

  if (!data.points) {
    throw new Error("Points are required");
  }

  return await prisma.code.create({
    data,
  });
}

export async function getCode(code: string) {
  return await prisma.code.findUnique({
    where: {
      code,
    },
  });
}
export async function getCodeById(id: number) {
  return await prisma.code.findUnique({
    where: {
      id,
    },
  });
}

export async function getCodesOfQuest(id: string) {
  return await prisma.code.findMany({
    where: {
      questId: parseInt(id),
    },
  });
}

export async function getCodes(n?: number) {
  return await prisma.code.findMany({
    take: n,
  });
}

export async function updateCode(id: number, data: Partial<Code>) {
  const validatedData = codeSchema.partial().safeParse(data);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid code data");
  }

  if (data.isQuest) {
    if (!data.questId) {
      throw new Error("Quest ID is required");
    }
    let quest = await prisma.quest.findUnique({
      where: {
        id: data.questId!,
      },
    });

    if (!quest) {
      throw new Error("Quest not found");
    }
    data.points = quest.points || 1;
  }

  if (!data.points) {
    throw new Error("Points are required");
  }

  return await prisma.code.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCode(id: number) {
  return await prisma.code.delete({
    where: {
      id,
    },
  });
}

export async function userScannedCode(userId: string, code: Code) {
  return await prisma.history.create({
    data: {
      userId,
      codeId: code.id,
      points: code.points,
      description: `Scanned code ${code.code} avec description ${code.description}`,
    },
  });
}
