// types/next-auth.d.ts
import NextAuth, { DefaultSession, User } from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError";
    user?: {
      id?: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
    role?: string;
    expires_at?: number; 
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}
