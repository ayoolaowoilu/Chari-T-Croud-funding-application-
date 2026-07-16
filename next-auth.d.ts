import NextAuth from "next-auth"
import { ProviderType } from "next-auth/providers"

// Extend the Profile interface for OAuth providers
declare module "next-auth" {
  interface Profile {
    id?: string
    name?: string
    email?: string
    image?: string | null
    picture?: string | null

    sub?: string 
    given_name?: string
    family_name?: string
    email_verified?: boolean
    locale?: string
  }

  interface Account {
    provider: ProviderType
    type: "oauth" | "email" | "credentials"
    providerAccountId: string
    access_token?: string
    token_type?: string
    scope?: string
    expires_at?: number
    // Add custom fields you want to store
    refresh_token?: string
    id_token?: string
    session_state?: string
  }

  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string
      image?: string | Blob | any
      provider?: string
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string
    name?: string
    picture?: string | null
    provider?: string
    userId?: string
    role?: string
  }
}



// If you need to extend User as well
declare module "next-auth" {
  interface User {
    id?: string
    full_name?: string
    image?: string | null
    email?: string | null
    method?: string
    // Add your custom database fields here
  }
}