
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import db from "@/app/lib/DBschema"
import Twitter from "next-auth/providers/twitter"
import { sendSingleEmail } from "@/app/lib/emails/email"
import { welcomeEmail } from "@/app/lib/emails/email_templates"


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
        "SELECT * FROM users WHERE email = ?",
        [profile?.email]
      )
         await sendSingleEmail(profile?.email  as string,  { from : "Welcome Back <support@chari-t.live>" , 
          subject : "Welcome Back" , html:welcomeEmail({name:profile?.name as string , companyName:"Chari-T" , loginUrl:`${process.env.API_URL}/causes/get`})})
       
      if (rows.length === 0) {
        await db.query(
          "INSERT INTO users(full_name, image, email, method) VALUES(?,?,?,?)",
          [profile?.name, profile?.image || profile?.picture, profile?.email, account?.provider]
        )
        await sendSingleEmail(profile?.email  as string,  { from : "Welcome <support@chari-t.live>" , 
          subject : "Welcome " , html:welcomeEmail({name:profile?.name as string , companyName:"Chari-T" , loginUrl:`${process.env.API_URL}/causes/get`})})
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