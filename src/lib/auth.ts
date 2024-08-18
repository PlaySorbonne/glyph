import NextAuth, { User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import credentials from "next-auth/providers/credentials";

export const { auth, handlers } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider,
    GoogleProvider,
    credentials({
      name: "Username Only",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials.username) return null;
        let [user, ..._] = await prisma.user.findMany({
          where: {
            name: credentials.username as string,
          },
        });
        if (user) {
          let [account, ...__] = await prisma.account.findMany({
            where: {
              userId: user.id,
            },
          });
          // Si une autre manière de se connecter est possible, on refuse
          if (account) return null;
          else return user;
        }

        return await prisma.user.create({
          data: {
            name: credentials.username as string,
          },
        });
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.verified_email === true) {
        return true;
      }

      // pour l'instant on connecte tout le monde, on verra après
      return true;
    },
  },
});
