"use client"

import { useForm } from "react-hook-form"
import { zProductSchema, ProductSchema } from "@/types/product-schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { DollarSign } from "lucide-react"
import Tiptap from "./tiptap"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { createProduct } from "@/server/actions/create-product"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getProduct } from "@/server/actions/get-product"
import { useEffect } from "react"

export default function ProductForm(){
	const form = useForm<zProductSchema>({
		defaultValues: {
			title: "",
			description: "",
			price: 0,
		},
	})

	return (

		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
			<Form {...form}>
				<form onSubmit={()=> console.log("hey")} className="space-y-4">
					{/* TITLE */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Title</FormLabel>
								<FormControl>
									<Input placeholder="Saekdong Stripe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* DESCRIPTION */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									{/* <Input placeholder="Saekdong Stripe" {...field} /> */}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* PRICE */}
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Product Price</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<DollarSign size={36} className="p-2 bg-muted rounded-md"/>
										<Input {...field} 
											type="number" 
											placeholder="Your price in AUD" 
											step="0.1"
											min={0}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

        			<Button type="submit"
						className="w-full"
					>
						Submit
					</Button>
      			</form>
    			</Form>
			</CardContent>
		</Card>

	)
}
