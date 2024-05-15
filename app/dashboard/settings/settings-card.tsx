'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Session } from "next-auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"  
import { SettingsSchema } from "@/types/settings-schema"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
// import { settings } from "@/server/actions/settings"
// import { UploadButton } from "@/app/api/uploadthing/upload"


type SettingsForm = {
	session: Session
}

export default function SettingCard(session: SettingsForm) {
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [avatarUploading, setAvatarUploading] = useState(false)


	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: undefined,
			newPassword: undefined,
			name: session.session.user?.name || undefined,
			email: session.session.user?.email || undefined,
			// isTwoFactorEnabled: session.session.user?.isTwoFactorEnabled || false,
		}
	})

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		execute(values)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Settings</CardTitle>
				<CardDescription>Update your account settings</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

						{/* NAME */} 
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" disabled={status === "executing"} {...field} />
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
						/>

						{/* AVATAR */} 
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Avatar</FormLabel>
									<div className="flex items-center gap-4">
										{!form.getValues('image') && (
											<div className="font-bold">
												{session.session.user?.name?.charAt(0).toUpperCase()}
											</div>
										)}
										{form.getValues('image') && (
											<Image 
												src={form.getValues('image')!}
												width={42}
												height={42}
												className="rounded-full"
											/>
										)}

									</div>
									<FormControl>
										<Input 
											type="hidden"
											placeholder="User image" 
											disabled={status === "executing"} {...field} 
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* PASSWORD */} 
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input placeholder="*******" disabled={status === "executing"} {...field} />
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
						/>


						{/* NEW PASSWORD */} 
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input placeholder="*******" disabled={status === "executing"} {...field} />
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
						/>

						{/* TWO FACTORS */}	
						<FormField
							control={form.control}
							name="isTwoFactorEnabled"
							render={({ field }) => (
								<FormItem>
								<FormLabel>Two Factor Authentification</FormLabel>
								<FormDescription>
									Enable two factor authenntification for your account
								</FormDescription>
								<FormControl>
									<Switch disabled={status === 'executing'} />
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
						/>

						<FormError/>
						<FormSuccess/>
						<Button
							type="submit"
							disabled={status === "executing" || avatarUploading}
						>
							Update your settings
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>


	)
}