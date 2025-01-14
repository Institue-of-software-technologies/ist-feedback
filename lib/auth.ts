import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import api from './axios';

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
          rememberMe: { label: "Remember Me", type: "checkbox" },
        },
        async authorize(credentials) {
          if (!credentials) throw new Error("Missing credentials");
  
          const { email, password, rememberMe } = credentials;
  
          try {
            const response = await api.post('/ /login', {
              email: email,
              password: password,
              rememberMe: rememberMe,
            });
  
            if (response.status !== 200) {
              throw new Error(`error: ${response.data.message}`);
            }
  
            const useRolesPermissions = response.data.client;
            return useRolesPermissions; // Send the client data to NextAuth
          } catch (error) {
            console.error("Authorize error:", error);
            throw new Error("Invalid login credentials");
          }
        },
      }),
    ],
    session: {
      strategy: "jwt", // Use JWT for stateless sessions
    },
    pages: {
      signIn: '/login', // Define custom login page if needed
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.username = user.username;
          token.role = user.role;
          token.permissions = user.permissions;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user = {
            id: token.id,
            username: token.username,
            role: token.role,
            permissions: token.permissions,
          };
        }
        return session;
      },
    },
}