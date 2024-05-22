import { auth } from "@/server/auth"
import { redirect } from "next/dist/server/api-utils"
import ProductForm from "./product-from"

export default async function AddProduct(){
	const session = await auth()
	if (session?.user.role !== 'admin') return redirect('/dashboard/settings')

	return(
		<ProductForm/>
	)
}