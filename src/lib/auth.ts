import type { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import db from './db';
import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Partial<Record<'email' | 'password', unknown>>
      ) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (isPasswordValid) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      // Include the token in the session
      return {
        ...session,
        token: token,
      };
    },
    jwt: async ({ user, token }: { user?: User; token: JWT }) => {
      if (user) {
        token.uid = user.id as string;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
