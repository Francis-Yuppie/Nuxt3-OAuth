import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import { NuxtAuthHandler } from '#auth'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
//@ts-expect-error
import bcrypt from 'bcrypt';


const prisma = new PrismaClient()

export default NuxtAuthHandler({
    adapter: PrismaAdapter(prisma),
    secret: 'ss',
    providers: [

        // Uncomment the code for Github Auth to work

        // //@ts-expect-error
        // GithubProvider.default({
        //     clientId: useRuntimeConfig().gitHubId,
        //     clientSecret: useRuntimeConfig().gitHubSecret

        // }),

        //@ts-expect-error
        GoogleProvider.default({
            clientId: useRuntimeConfig().googleId,
            clientSecret: useRuntimeConfig().googleScret

        }),

        //@ts-expect-error
        CredentialsProvider.default({
            name: 'redentials',

            credentials: {
                email: {
                    label: 'email',
                    type: 'email',
                },
                password: {
                    type: 'password',
                    label: 'password'
                }
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Required inputs',
                    })
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.hashedPassword) {
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Invalid credentials'
                    })
                }

                const correctPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
                if (!correctPassword) {
                    throw createError({
                        statusCode: 401,
                        statusMessage: 'Invalid credentials'
                    })
                }

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/'
    },
    session: {
        strategy: 'jwt'
    }
})