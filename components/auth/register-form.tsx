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

import { FormSuccess } from "./form-success"
import {Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {useForm} from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { RegisterSchema } from "@/types/register-schema"
import * as z from "zod"
import { useAction } from 'next-safe-action/hooks'
import cn from "classnames";
import { emailRegister } from "@/server/actions/email-register"
import { FormError } from "./form-error"

export const RegisterForm = () => {

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const{execute, status}  = useAction(emailRegister, {
		onSuccess(data){
			if (data.error) setError(data.error)
			if (data.success) setSuccess(data.success)
		}
	})


	

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		execute(values)
	}

	return (
		<AuthCard
			cardTitle="Create ann account"
			backButtonHref="/auth/login"
			backButtonLabel="Already have an account?"
			showSocials
		>
			<div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
					<div>
						<FormField
							control={form.control}
							name="name"
							render={({field}) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} 
											placeholder="name" 
											type="name"
											autoComplete="name"
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>

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
						<FormSuccess message={success}/>
						<FormError message={error}/>
						<Button size={"sm"} variant={'link'} asChild>
							<Link href='/auth/reset'>Forgot your password</Link>
						</Button>
					</div>
					<Button type="submit" className={cn("w-full my-2", status === 'executing' ? "animate-pulse" : "")}>
						{"Register"}
					</Button>
					</form>
				</Form>
			</div>
		</AuthCard>
	)
}