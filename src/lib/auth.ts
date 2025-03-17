import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER || "",
      from: process.env.EMAIL_FROM || "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }) {
      // Check if user exists in DB
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });
      
      // If user doesn't exist, create them
      if (!dbUser && user.email) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || null,
          },
        });
      }
      
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
  },
});

// Helper to get the current user's ID
export async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}

// Check if the user is authenticated
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
} 