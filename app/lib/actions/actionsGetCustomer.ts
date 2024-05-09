"use server"

import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache'

export async function getCustomer(id: string) {
	noStore()
	try {
		const customer = await sql`SELECT * FROM customers WHERE id = ${id}`;
		return customer.rows[0];
	} catch (err) {
		console.error('Database Error:', err);
	}
}