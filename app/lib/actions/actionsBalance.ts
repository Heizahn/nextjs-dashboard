'use server';

import { sql } from "@vercel/postgres";
import { StatePay, PaySchema } from "@/app/dashboard/customers/[id]/pay/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';



export async function updateBalanceInvoice(amount: number, id: string, status: string) {
	const amountInCents = amount * 100
	try {
		if(status === 'pending'){
			await sql`
				UPDATE customers
				SET balance = balance - ${amountInCents}
				WHERE id = ${id};
			`
		}

		if(status === 'paid'){
			await sql`
				UPDATE customers
				SET balance = balance + ${amountInCents}
				WHERE id = ${id};
			`
		}

	} catch (err) {
		console.error('Database Error:', err);
	}
}

const CreatePay = PaySchema.omit({ id: true, date: true });
export async function addPayment(prevState: StatePay, formData: FormData) {
	const validatedFields = CreatePay.safeParse({
		customerId: formData.get('customer'),
		amount: formData.get('amount'),
		method: formData.get('method'),
		invoiceId: formData.get('invoice'),
	})


	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Campos faltantes. No se pudo registrar el pago.',
		}
	}

	const { customerId, amount, method, invoiceId } = validatedFields.data;

	const amountInCents = amount * 100;
	const date = new Date().toISOString().split('T')[0];

	if (invoiceId === '')  return redirect('/dashboard/customers');
	try {
		await sql`
			INSERT INTO paids (id_customer, amount, date, paymentmethod)
			VALUES (${customerId}, ${amountInCents}, ${date}, ${method})
		`;

		await updateBalanceInvoice(amount, customerId, 'paid');

		const invoice = await sql`SELECT amount FROM invoices WHERE id = ${invoiceId}`;
		if(invoice.rows[0].amount === amountInCents){
			await sql`UPDATE invoices SET status = 'paid' WHERE id = ${invoiceId}`
		} else {
			const credits = (await sql`SELECT * FROM paymentcredit WHERE id_customer = ${customerId}`).rows

			if(credits.length > 0){
				let result = amountInCents + credits[0].amount

				if (result >= invoice.rows[0].amount) {
					await sql`UPDATE invoices SET status = 'paid' WHERE id = ${invoiceId}`

					await sql`DELETE FROM paymentcredit WHERE id_customer = ${customerId}`
					
					await sql`INSET INTO paids (id_customer, amount, date,) VALUES (${customerId}, ${result}, ${date})`
				} else {
					await sql`DELETE FROM paymentcredit WHERE id_customer = ${customerId}`

					await sql`INSET INTO paids (id_customer, amount, date,) VALUES (${customerId}, ${result}, ${date})`
				}
			} else {
				
				await paymentCredit(invoiceId, customerId)
			}


		}

		const customer = await sql`SELECT balance FROM customers WHERE id = ${customerId}`;

		if(customer.rows[0].balance >= 0 ){
			await sql`UPDATE customers SET status = 'active' WHERE id = ${customerId}`
		} else if(customer.rows[0].balance < 0){
			await sql`UPDATE customers SET status = 'moroso' WHERE id = ${customerId}`
		}



	} catch (err) {
		return {
			message: 'Database Error: Failed to Add Payment.',
		}
	}  
	revalidatePath('/dashboard/customers');
	redirect('/dashboard/customers');
}



async function paymentCredit(id_invoice: string, id_customer: string) {
	try {

		const pays = (await sql`SELECT * FROM paids WHERE id_customer = ${id_customer}`).rows

		const invoice = (await sql`SELECT amount FROM invoices WHERE id = ${id_invoice}`).rows[0]

		let totalPays = 0


		pays.forEach((pay: any) =>{
			totalPays += pay.amount
		})

		if(totalPays >= invoice.amount){
			await sql`UPDATE invoices SET status = 'paid' WHERE id = ${id_invoice}`

			let result = totalPays - invoice.amount

			if (result > 0){
				const date = new Date().toISOString().split('T')[0];
				await sql`INSERT INTO paymentcredit(amount, date, id_customer) VALUES(
					${result}, ${date}, ${id_customer}
				)`
			}
		}
	} catch(err) {
		console.error('Database Error:', err);
	}
}