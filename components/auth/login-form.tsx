'use client'
import { useState } from "react"
import { AuthCard } from "./auth-card"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"

import {Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { LoginSchema } from "@/types/login-schema"
import * as z from "zod"
import { emailSignIn } from "@/server/actions/email-signin"
import { useAction } from 'next-safe-action/hooks'
import cn from "classnames";

export const LoginForm = () => {
	const form = useForm({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const {execute, status} = useAction(emailSignIn, {
		onSuccess(data) {}
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		execute(values)
	}

	return (
		<AuthCard
			cardTitle="Welcome back"
			backButtonHref="/auth/register"
			backButtonLabel="Create a new account"
			showSocials
		>
			<div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
					<div>
						<FormField
							control={form.control}
							name="email"
							render={({field}) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} 
											placeholder="developedby@gmail.com" 
											type="email"
											autoComplete="email"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({field}) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input {...field} 
											placeholder="*****" 
											type="password"
											autoComplete="current-password"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button size={"sm"} variant={'link'} asChild>
							<Link href='/auth/reset'>Forgot your password</Link>
						</Button>
					</div>
					<Button type="submit" className={cn("w-full my-2", status === 'executing' ? "animate-pulse" : "")}>
						{"Login"}
					</Button>
					</form>
				</Form>
			</div>
		</AuthCard>
	)
}