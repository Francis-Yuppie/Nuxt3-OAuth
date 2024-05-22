# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

# INFO:

This is a Nuxt 3 Oauth Demo  using prisma, MongoDb, Github and Google OAuth, it also have normal user registration and login

## Modules used for auth

Nuxt Auth and sidebase: [view documentation](https://sidebase.io/nuxt-auth/getting-started/installation)

Also Prisma is used to create the models for the MongoDb

## Directories

The key directories for this auth demo is the pages, components, Prisma and the server

```bash
        pages/
            index.vue
        components/
            icons/
            AuthForm.vue
            Button.vue
            Input.vue
        prisma/
            schema.prisma
        server/
            api/
                auth/
                    [...].ts catch all route
                    register.post.ts
        
```

## [...].ts

```TypeScript

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

```

## register.post.ts

```TypeScript

import { H3Event } from 'h3';
import { PrismaClient } from "@prisma/client";
//@ts-expect-error
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const { name, email, password } = await readBody(event);

        console.log(name, email, password)
        if (!name || !email || !password) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Required inputs',
                message: 'Email, Password, and Name are required'
            })

        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: {
                email,
                hashedPassword,
                name
            }
        })

        return { user }
    } catch (err) {
        console.error(err)
        throw createError({
            statusCode: 500,
            statusMessage: 'something went wrong',
        })
    }
})



```


## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
