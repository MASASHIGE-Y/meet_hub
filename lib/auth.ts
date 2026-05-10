import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: "Guest",
      credentials: {},
      async authorize() {
        const guestUser = await prisma.user.upsert({
          where: {
            email: "guest@example.com",
          },
          update: {},
          create: {
            email: "guest@example.com",
            name: "ゲストユーザー",
            image: null,
            bio: "採用担当者向けのゲストユーザーです。",
            birthDate: new Date("2000-01-01"),
            isOnboarded: true,
          },
        });

        return {
          id: guestUser.id,
          name: guestUser.name,
          email: guestUser.email,
          image: guestUser.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
};
