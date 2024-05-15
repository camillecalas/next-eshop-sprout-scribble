import { redirect } from "next/dist/server/api-utils";



export default function DashboardPage() {
	redirect('/dashboard/settings')

}