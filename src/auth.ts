import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn({ user }) {
      return user.email === process.env.ADMIN_EMAIL;
    },
  },
});
