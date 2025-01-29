import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db"; // Prisma client
import bcrypt from 'bcryptjs';
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email tidak boleh kosong"),
  password: z.string().min(6, "Password harus memiliki minimal 6 karakter"),
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }
          // Validasi dengan zod
          formSchema.parse(credentials);  // Ini akan melempar error jika validasi gagal

          // Check if the user exists
          const user = await db.customer.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new Error("Invalid email or password");
          }

          // Return the user object
          return { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address };
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Jika validasi gagal, lemparkan error yang sesuai
          throw new Error(error.errors.map(e => e.message).join(", "));
        } else {
          throw error; // Error lain (misalnya database error)
        }
      }
    }})
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    // Extend token refresh window
    maxAge: 15 * 60
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("JWT callback token:", token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.address = user.address; 
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Session callback token:", token);
      if (token) {
        session.user = {
          id: token.id as number,
          email: token.email ?? "",
          name: token.name ?? "",
          phone: typeof token.phone === 'string' ? token.phone : "",
          address: typeof token.address === 'string' ? token.address : "",
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };