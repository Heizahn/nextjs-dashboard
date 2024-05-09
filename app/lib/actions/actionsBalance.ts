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

	try {
		await sql`
			INSERT INTO paids (customer_id, amount, method, date)
			VALUES (${customerId}, ${amountInCents}, ${method}, ${date})
		`;

		await updateBalanceInvoice(amount, customerId, 'paid');

		const invoice = await sql`SELECT amout FROM invoices WHERE id = ${invoiceId}`;
		if (invoice.rows[0].amount === amountInCents) {
			await sql`UPDATE invoices SET status = 'paid' WHERE id = ${invoiceId}`;
		} else {
			const idPay = await sql`SELECT id FROM paids ORDER BY date ASC LIMIT 1`;

			await sql`INSERT INTO paymentcredit(id_paid, id_invoice, amount, date) VALUES(${idPay.rows[0].id}, ${invoiceId}, ${amountInCents}, ${date})`;

		}

		revalidatePath('/dashboard/customers');
		redirect('/dashboard/customers');
	} catch (err) {
		return {
			message: 'Database Error: Failed to Add Payment.',
		}
	}  
}