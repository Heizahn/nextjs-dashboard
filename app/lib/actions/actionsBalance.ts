'use server';

import { sql } from "@vercel/postgres";
import { StatePay, PaySchema, PaymentCredit} from "@/app/dashboard/customers/[id]/pay/schemas";
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
			await paymentCredit({id_customer: customerId, amount, date})

			const credits = (await sql`SELECT amount FROM paymentcredit WHERE id_customer = ${customerId}`).rows

			if (credits.length > 1){
				let result = 0

				credits.forEach(credit => result += credit.amount)
				console.log(result)

				const invoice = (await sql`SELECT * FROM invoices WHERE id=${invoiceId}`).rows[0]

				if (result >= invoice.amount){
					await sql`UPDATE invoices SET status='paid' WHeRE id=${invoiceId}`
					await sql`DELETE FROM paymentcredit WHERE id_customer=${customerId}`
					await paymentCredit({id_customer: customerId, amount: result, date})
				} else {
					await paymentCredit({id_customer: customerId, amount: result, date})
				}
			}
		}

		const customer = await sql`SELECT balance FROM customers WHERE id = ${customerId}`;

		if(customer.rows[0].balance >= 0 ){
			await sql`UPDATE customers SET status ='active' WHERE id = ${customerId}`
		}
		
		if(customer.rows[0].balance < 0){
			await sql`UPDATE customers SET status='moroso' WHERE id = ${customerId}`
		}

	} catch (err) {
		return {
			message: 'Database Error: Failed to Add Payment.',
		}
	} finally {
		revalidatePath('/dashboard/customers');
		redirect('/dashboard/customers');
	}
}


async function paymentCredit(credit: PaymentCredit) {
	try {
		await sql`INSERT INTO paymentcredit(id_customer, amount, date) VALUES (${credit.id_customer}, ${credit.amount * 100}, ${credit.date})`
	} catch(err) {
		console.error('Database Error:', err);
	}
}