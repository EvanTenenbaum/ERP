// Update to lib/auth.js
// Using dynamic import approach for Prisma client

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { dummyPrismaClient, getPrismaClient } from "./dynamic-prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Create a modified adapter that uses dynamic imports
const createDynamicPrismaAdapter = () => {
  // Return a modified adapter that gets prisma dynamically
  return {
    ...PrismaAdapter(dummyPrismaClient),
    // Override methods to use dynamic prisma client
    async createUser(data) {
      const prisma = await getPrismaClient();
      return prisma.user.create({ data });
    },
    async getUser(id) {
      const prisma = await getPrismaClient();
      return prisma.user.findUnique({ where: { id } });
    },
    async getUserByEmail(email) {
      const prisma = await getPrismaClient();
      return prisma.user.findUnique({ where: { email } });
    },
    // Add other methods as needed
  };
};

export const authOptions = {
  adapter: createDynamicPrismaAdapter(),
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

        // Get Prisma client dynamically
        const prisma = await getPrismaClient();

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
