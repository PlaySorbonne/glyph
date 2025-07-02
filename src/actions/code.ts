import prisma from "@/lib/db";
import { codeFormat, codeSchema } from "@/utils/zod";
import { Code, History, User } from "@prisma/client";
import { getSession } from "./auth";
import { getFinishedPrimaryQuests, getPrimaryQuests } from "./quests";

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

export async function userScannedCodeFront(code: string): Promise<
  | {
      error: true;
      msg: string;
      data?: null;
    }
  | {
      error: false;
      data: History;
      msg?: null;
    }
> {
  let userSession = await getSession();

  let session = await prisma.session.findFirst({
    where: {
      sessionToken: userSession,
    },
    include: {
      user: true,
    },
  });

  let user = session?.user;

  if (!user) {
    return {
      error: true,
      msg: "Utilisateur non trouvé",
    };
  }

  let codeData = await prisma.code.findFirst({
    where: {
      code,
    },
  });

  if (!codeData) {
    return {
      error: true,
      msg: "Code non trouvé",
    };
  }

  let out;
  try {
    out = await userScannedCode(user, codeData);
  } catch (e: any) {
    return {
      error: true,
      msg: e.message,
    };
  }
  return {
    error: false,
    data: out,
  };
}

export async function userScannedCode(user: User, code: Code) {
  if (process.env.NO_SCAN) {
    throw new Error("Le scan est désactivé");
  }

  if (code.expires && code.expires < new Date()) {
    throw new Error("Code expiré");
  }

  if (code.code.startsWith("ending")) {
    let [quests, completedQuests] = await Promise.all([
      getPrimaryQuests(),
      getFinishedPrimaryQuests(user.id),
    ]);
    if (quests.length - 1 !== completedQuests.length) {
      throw new Error(
        "Eh non, petit malin va. Complète toutes les quêtes principales et reconstitue le Glyph  pour accéder a la fin  du jeu"
      );
    }
  }

  let quest;

  let [history] = await prisma.history.findMany({
    where: {
      userId: user.id,
      codeId: code.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (code.isQuest) {
    if (history) {
      throw new Error("Le code a déjà été scanné");
    }
  }
  let time = 10 * 60 * 1000;

  if (history) console.log(history.date, new Date(Date.now() - time));
  if (history && history.date > new Date(Date.now() - time)) {
    throw new Error("Le code a déjà été scanné il y a moins de 10 minutes");
  }

  if (code.isQuest) {
    quest = await prisma.quest.findUnique({
      where: {
        id: code.questId!,
      },
    });
    code.points = quest?.points || 1;
  }

  await prisma.fraternity.update({
    where: {
      id: user.fraternityId!,
    },
    data: {
      score: {
        increment: code.points,
      },
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      score: {
        increment: code.points,
      },
    },
  });

  return await prisma.history.create({
    data: {
      userId: user.id,
      codeId: code.id,
      questId: code.questId,
      points: code.points,
      description: code.isQuest
        ? `Vous avez fini la quête ${quest?.title}`
        : `Vous avez accompli une quête secondaire de ${code.points} points`,
    },
  });
}
