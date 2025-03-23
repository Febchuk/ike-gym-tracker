import prisma from '@/app/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Check if both email and password were provided
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Look up user in database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If not user reject login attempt
        if (!user) {
          return null;
        }

        // Compare provided password with the stored hash
        const isPasswordValid = await compare(credentials.password, user.passwordHash);

        // If pasword doesnt match reject login
        if (!isPasswordValid) {
          return null;
        }

        // If all checks out return object with user data
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (token && session && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
