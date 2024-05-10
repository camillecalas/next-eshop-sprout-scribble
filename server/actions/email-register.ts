'use server'

import { RegisterSchema } from '@/types/register-schema';
import {createSafeActionClient} from 'next-safe-action'
import { db } from '..';
import {eq} from "drizzle-orm"
import {users} from '../schema'
import bcrypt from 'bcrypt'
import { generateEmailVerificationToken } from '@/server/actions/tokens';
import { sendVerificationEmail } from './email';


const action = createSafeActionClient();

export const emailRegister = action(RegisterSchema, async ({email, name, password}) => {
	const hashedPassword = await bcrypt.hash(password, 10)
	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, email),
	})
	
	//check email is already in the database
	if (existingUser) {
		if (!existingUser?.emailVerified) {
			const verificationToken = await generateEmailVerificationToken(email);
			await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)

			return {success: "Email conformation resent"}
		}
		return {error: "Email already in use"}
	}
	await db.insert(users).values({
		email,
		name,
	})
	const verificationToken = await generateEmailVerificationToken(email)
	await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
	return {success: "Confirmation email set"}
}
)