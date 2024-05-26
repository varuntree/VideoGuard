import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../prisma/prisma";
import { User, Profile, Account, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { pages } from "next/dist/build/templates/app-page";



export const authoptions = {
  providers: [
    GoogleProvider({
      id: "google-owner",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/youtube.upload",
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google-owner`,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GoogleProvider({
      id: "google-editor",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid profile email",
          redirect_uri:  `${process.env.NEXTAUTH_URL}/api/auth/callback/google-editor`,
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account, user }: { profile?: Profile; account: Account | null; user: User }) {
      if (!profile || !account) {
        return false;
      }
      const role = account.scope?.includes("https://www.googleapis.com/auth/youtube.upload") ? "owner" : "editor";
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            name: user.name || "",
            image: user.image || "",
            role,
          },
          create: {
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
            role,
            editorcode: String(Math.floor(Math.random() * 1000000) + 1) + user.email,
          },
        });
      } catch (e) {
        console.log(e);
      }

      return true;
    },
    async jwt({ token, user, account }: { token: JWT; user: User; account: Account| null; profile?: Profile }) {
      if (account) {
        token.id = user.id;
        token.accessToken = account.access_token!;
        token.expires_at = account.expires_at!;
        token.refresh_token = account.refresh_token!;
        token.role = account.scope?.includes("https://www.googleapis.com/auth/youtube.upload") ? "owner" : "editor";
        return token;
      }

      // If the access token has not expired yet, return the token
      if (Date.now() < (token.expires_at ?? 0) * 1000) {
        return token;
      }

      // If the access token has expired, try to refresh it
      if (!token.refresh_token) {
        throw new Error("Missing refresh token");
      }

      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
          }),
          method: "POST",
        });

        const tokens = await response.json();
        console.log("Refreshed tokens:", tokens);

        if (!response.ok) {
          throw tokens;
        }

        return {
          ...token, // Keep the previous token properties
          accessToken: tokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
          // Fall back to old refresh token, but note that many providers may only allow using a refresh token once.
          refresh_token: tokens.refresh_token ?? token.refresh_token,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        // The error property will be used client-side to handle the refresh token error
        return { ...token, error: "RefreshAccessTokenError" as const };
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages:{
    signIn: '/'
  },
  async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
    // If the user is logging in, redirect to /dashboard
    if (url.startsWith(baseUrl)) {
      return `${baseUrl}/dashboard`;
    }
    return url;
  },
};

export default NextAuth(authoptions);
