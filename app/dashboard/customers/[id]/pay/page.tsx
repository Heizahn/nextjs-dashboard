import { fetchInvoiceByIdCustomer } from "@/app/lib/data";
import { FormPay } from "@/app/ui/customers/pay/FormPay";
import { sql } from "@vercel/postgres";

export default async function Page({params}: {params: {id: string}}) {
	const id = params.id
	const invoices = await fetchInvoiceByIdCustomer(id)
	const customer = await sql`SELECT name FROM customers WHERE id = ${id}`
	return (
		<>
			<FormPay id={id} invoices={invoices} nameCustomer={customer.rows[0].name} /> 
		</>
	)
}