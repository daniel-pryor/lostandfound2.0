import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'

import User from '@/models/user'
import { connectToDB } from '@/utils/database'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session?.user?.email,
      })
      if (session.user) {
        session.user.id = sessionUser._id.toString()
      }
      return session
    },
    async signIn({ profile }) {
      try {
        await connectToDB()

        if (!profile || !profile.email) {
          throw new Error('Invalid profile data')
        }

        // check if user already exists
        const userExists = await User.findOne({
          email: profile.email,
        })

        // if not, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name?.replace(' ', '').toLowerCase(),
            image: profile.picture,
          })
        }

        return true
      } catch (error) {
        console.error('Error during signIn:', error)
        return false
      }
    },
  },
})

export { handler as GET, handler as POST }
