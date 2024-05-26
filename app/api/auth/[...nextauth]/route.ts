
import { authoptions } from "@/lib/authOption"
import NextAuth from "next-auth"

const handler = NextAuth(authoptions)

export { handler as GET, handler as POST }