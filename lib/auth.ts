import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const responseData = await response.json();

          if (responseData.token) {
            return { ...responseData };
          }
          throw new Error("Invalid email or password");
        } catch (error) {
          console.error("Error logging in:", error);
          throw new Error("Invalid email or password");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    // Extend token refresh window
    maxAge: 15 * 60
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.token = user.token;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.phone = user.phone;
        token.address = user.address; 
      }

      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.phone = session.user.phone;
        token.address = session.user.address; 
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
        session.token = token.token as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export const handler = NextAuth(authOptions);