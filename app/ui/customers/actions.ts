'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';


export async function deleteCustomer(idClient: string) {
	try {
		const client =  await sql`SELECT * FROM customers WHERE id = ${idClient}`;

		const {id, name, idcard, phone, ip, plan, connectiontype, sector, location, rb, box, port, status, balance, mac} = client.rows[0];

		await sql`INSERT INTO retiredcustomers(id, name, idcard, phone, ip, plan, connectiontype, sector, location, rb, box, port, status, balance, mac) 
		VALUES (${id}, ${name}, ${idcard}, ${phone}, ${ip}, ${plan}, ${connectiontype}, ${sector}, ${location}, ${rb}, ${box}, ${port}, ${status}, ${balance}, ${mac})`;


		await sql`DELETE FROM customers WHERE id = ${id}`;
		revalidatePath('/dashboard/customers');
	} catch (err) {
		console.error('Database Error:', err);
	}
}
