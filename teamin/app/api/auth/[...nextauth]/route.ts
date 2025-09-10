import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "../../../../../MDB_Schema/MDB";
import bcrypt from "bcryptjs"; // optional if using hashed passwords

const authOptions :any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "123456" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ email: credentials.email });
        //console.log(user);
        if (!user) return null;


       // const isValid = await bcrypt.compare(credentials.password || '', user.password || '');
        const isValid = credentials.password === user.password;
        if (!isValid) return null;

       //console.log(user.profile_pic,user._id)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          profile_pic: user.profile_pic || null,  
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }:{token:any, user:any}) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.profile_pic;
      }
      return token;
    },
    async session({ session, token } : {session:any, token:any}) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
        };
      }
    // console.log(session.user)
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
