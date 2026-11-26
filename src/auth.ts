import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { googleEnabled } from "@/lib/config";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: { id: string; name: string; email: string; image?: string | null };
  }
}

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      await connectDB();
      const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select("+passwordHash");
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;
      return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
    },
  }),
];
if (googleEnabled) providers.push(Google);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    // Create or link a database user the first time someone signs in with Google.
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;
      await connectDB();
      const dbUser = await User.findOneAndUpdate(
        { email: user.email.toLowerCase() },
        { $setOnInsert: { name: user.name ?? user.email.split("@")[0], email: user.email.toLowerCase() }, $set: { image: user.image } },
        { upsert: true, new: true },
      );
      user.id = dbUser._id.toString();
      return true;
    },
    // The JWT only carries the user id; plan and role are always read fresh from the
    // database, so a Stripe webhook takes effect on the next request.
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
});
