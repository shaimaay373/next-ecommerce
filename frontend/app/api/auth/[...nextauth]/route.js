import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await axios.post('http://localhost:4000/api/auth/google', {
          name: user.name,
          email: user.email,
          avatar: user.image,
        });
        user.accessToken = res.data.accessToken;
        user.role = res.data.user.role;
        user.id = res.data.user._id;
        return true;
      } catch (err) {
       
        console.log('Google Auth Error:', err.response?.data || err.message);
        return true; // خليناها true مؤقتاً عشان يدخل
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };