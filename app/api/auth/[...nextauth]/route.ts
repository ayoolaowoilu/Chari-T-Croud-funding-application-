// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import db from "@/app/lib/DBschema"
import Twitter from "next-auth/providers/twitter"

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    provider?: string
  
  }
}

const handler  = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),Twitter({
       clientId:process.env.X_CONSUMER_KEY!,
       clientSecret:process.env.X_SECRET_KEY!
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, 
  },
  callbacks: {
    async signIn({ account, profile }) {
  
      const [rows]: any = await db.query(
        "SELECT * FROM Users WHERE Email = ?",
        [profile?.email]
      )

      if (rows.length === 0) {
        await db.query(
          "INSERT INTO Users(Full_name, Image, Email, Method) VALUES(?,?,?,?)",
          [profile?.name, profile?.image || profile?.picture, profile?.email, account?.provider]
        )
      }

      return true
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email
        token.name = profile.name
        token.picture = profile.image || profile.picture
        token.provider = account.provider
        token.userId = profile.sub 
       
      }
      
      return token
    },

    async session({ session, token }) {
     
      session.user.id = token.userId
      session.user.email = token.email
      session.user.name = token.name
      session.user.image = token.picture
      session.user.provider = token.provider
     
      
      return session
    }
  }
})


export {handler as GET , handler as POST}