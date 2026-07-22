import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import https from 'https';
import db from '@/app/lib/DBschema';
import { sendSingleEmail } from '@/app/lib/emails/email';
import { welcomeEmail } from '@/app/lib/emails/email_templates';

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    provider?: string;
    role?: string;
  }
}

/**
 * Prefer IPv4 for OAuth discovery / token calls.
 * On many networks Node's dual-stack connect hits IPv6 first and times out
 * with AggregateError → next-auth SIGNIN_OAUTH_ERROR.
 */
const oauthHttpsAgent = new https.Agent({
  family: 4,
  keepAlive: true,
  timeout: 20_000,
});

const oauthHttpOptions = {
  timeout: 20_000,
  agent: oauthHttpsAgent,
};

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: oauthHttpOptions,
    }),
    Twitter({
      clientId: process.env.X_CONSUMER_KEY!,
      clientSecret: process.env.X_SECRET_KEY!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) return false;

      try {
        const [rows]: any = await db.query('SELECT id FROM users WHERE email = ?', [profile.email]);

        if (rows.length === 0) {
          await db.query('INSERT INTO users(full_name, image, email, method) VALUES(?,?,?,?)', [
            profile.name || 'User',
            profile.image || (profile as { picture?: string }).picture || null,
            profile.email,
            account?.provider || 'oauth',
          ]);

          try {
            await sendSingleEmail(profile.email, {
              from: 'Chari-T Welcomes you <support@chari-t.live>',
              subject: `${(profile.name || 'there').split(' ')[0]} - Welcome`,
              html: welcomeEmail({
                name: profile.name || 'there',
                companyName: 'Chari-T',
                loginUrl: `${process.env.API_URL || process.env.NEXTAUTH_URL || ''}/causes/get`,
              }),
            });
          } catch (e) {
            console.error('welcome email failed', e);
          }
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.image || (profile as { picture?: string }).picture;
        token.provider = account.provider;
      }

      const email = token.email || profile?.email;
      if (email) {
        try {
          const [rows]: any = await db.query(
            'SELECT id, role, full_name, image FROM users WHERE email = ?',
            [email],
          );
          if (rows?.length) {
            token.userId = String(rows[0].id);
            token.role = rows[0].role || 'donor';
            if (rows[0].full_name) token.name = rows[0].full_name;
            if (rows[0].image) token.picture = rows[0].image;
          }
        } catch (e) {
          console.error('jwt user lookup failed', e);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture as string | undefined;
        session.user.provider = token.provider;
        (session.user as { role?: string }).role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
