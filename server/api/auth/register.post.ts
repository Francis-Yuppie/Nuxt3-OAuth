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
