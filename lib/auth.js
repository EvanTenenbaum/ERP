// Updated lib/auth.js using simplified Prisma client approach
// Following official Prisma and Next.js best practices

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma"; // Import the simplified Prisma client
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Use standard PrismaAdapter with our singleton
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantId: { label: "Tenant ID", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.tenantId) {
          return null;
        }

        // Find user by email and tenant ID
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            tenantId: credentials.tenantId,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        // Get tenant information
        const tenant = await prisma.tenant.findUnique({
          where: { id: user.tenantId },
        });

        if (!tenant) {
          return null;
        }

        // Return user with tenant information
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: tenant.id,
          tenantName: tenant.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.tenantId = token.tenantId;
        session.user.tenantName = token.tenantName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
