import { generateSession } from "@/utils";
import { nameFormat, SESSION_TTL } from "@/utils/constants";
import prisma from "../db";

export type nameSignInData = { name: string; type: "name" };

export async function signInWithName(data: nameSignInData): Promise<
  | {
      error: true;
      msg: string;
    }
  | {
      error: false;
      name: string;
      session: string;
    }
> {
  if (!data?.name) {
    return {
      error: true,
      msg: "Le nom est requis",
    };
  }
  
  let parsed = nameFormat.safeParse(data.name);
  if (!parsed.success) {
    return {
      error: true,
      msg: parsed.error.message,
    };
  }


  let [user, ..._] = await prisma.user.findMany({
    where: {
      name: data.name,
    },
    include: {
      accounts: true,
    },
  });
  

  // Register
  if (!user) {
    let newUser = await prisma.user.create({
      data: {
        name: data.name,
      },
    });

    let session = await prisma.session.create({
      data: {
        userId: newUser.id,
        sessionToken: generateSession(newUser.id),
        expires:
          SESSION_TTL === -1
            ? new Date(2147483647000)
            : new Date(Date.now() + SESSION_TTL),
      },
    });
    return {
      error: false,
      name: data.name,
      session: session.sessionToken,
    };
  }

  if (user.accounts.length > 0) {
    return {
      error: true,
      msg: "Le compte est lié à google ou discord, veuillez vous connecter avec l'un de ces comptes.",
    };
  }

  let session = await prisma.session.create({
    data: {
      userId: user.id,
      sessionToken: generateSession(user.id),
      expires:
        SESSION_TTL === -1
          ? new Date(2147483647000)
          : new Date(Date.now() + SESSION_TTL),
    },
  });
  return {
    error: false,
    name: data.name,
    session: session.sessionToken,
  };
}
