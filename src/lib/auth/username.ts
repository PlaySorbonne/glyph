import { generateSession, SESSION_TTL } from "@/utils";
import { nameFormat } from "@/utils/zod";
import prisma from "../db";
import { User } from "@prisma/client";

export type nameSignInData = {
  name: string;
  type: "name";
  allowLogin?: boolean;
};

export async function signInWithName(data: nameSignInData): Promise<
  | {
      error: true;
      msg: string;
    }
  | {
      error: false;
      name: string;
      session: string;
      registered: boolean;
      user: User;
    }
> {

  let registered = false;
  if (!data?.name) {
    return {
      error: true,
      msg: "Le nom est requis",
    };
  }
  
  data.name = data.name.toLowerCase();

  let parsed = nameFormat.safeParse(data.name);
  if (!parsed.success) {
    return {
      error: true,
      msg: "Le nom doit contenir entre 4 et 20 caractères alphanumériques et ne contenir que des lettres, des chiffres, des points, des tirets et des underscores.",
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
    if (process.env.NO_REGISTER) {
      return {
        error: true,
        msg: "L'enregistrement est désactivé",
      };
    }
    
    user = await prisma.user.create({
      data: {
        name: data.name,
      },
      include: {
        accounts: true,
      },
    });
    registered = true;
  } else if (data.allowLogin === false) {
    return {
      error: true,
      msg: "Le nom est déjà pris",
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
    registered,
    user,
  };
}
