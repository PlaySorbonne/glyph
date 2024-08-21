import prisma from "@/lib/db";
import { codeFormat, codeSchema } from "@/utils/constants";
import { Code } from "@prisma/client";

export async function addCodeToQuest(
  id: string,
  data: { code: string } & Partial<Code>
) {
  const validatedData = codeFormat.safeParse(data.code);
  if (!validatedData.success) {
    console.error("Validation error:", validatedData.error);
    throw new Error("Invalid code data");
  }

  return await prisma.quest.update({
    where: {
      id: parseInt(id),
    },
    data: {
      Code: {
        create: {
          ...data,
          isQuest: true,
        },
      },
    },
  });
}

export async function addPointCode(
  data: { code: string; points: number } & Partial<Code>
) {
  const validatedData = codeFormat.safeParse(data.code);
  if (!validatedData.success) {
    console.error('Validation error:', validatedData.error);
    throw new Error('Invalid code data');
  }

  return await prisma.code.create({
    data: {
      ...data,
      isQuest: false,
    },
  });
}

export async function getCode(code: string) {
  return await prisma.code.findUnique({
    where: {
      code,
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
