'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { StateCustomerWireless, FormSchemaCustomerWireless } from '../ui/customers/schemas';

const CustomerWireless = FormSchemaCustomerWireless.omit({ id: true });

export async function CreateCustomerWireless(
	prevState: StateCustomerWireless,
	formData: FormData,
  ) {
	const validatedFields = CustomerWireless.safeParse({
	  name: formData.get('name'),
	  idCard: formData.get('idCard'),
	  phone: formData.get('phone'),
	  ip: formData.get('ip'),
	  plan: formData.get('plan'),
	  connectionType: formData.get('connectionType'),
	  sector: formData.get('sector'),
	  location: formData.get('location'),
	  rb: formData.get('rb'),
	});
  
	if (!(validatedFields.success)) {
	  return {
		errors: validatedFields.error.flatten().fieldErrors,
		message: 'Campos faltantes. No se pudo crear el cliente.',
	  };
	}
  
	const {
	  name,
	  connectionType,
	  idCard,
	  phone,
	  ip,
	  plan,
	  sector,
	  location,
	  rb,
	} = validatedFields.data;
	
	
	const planInCent = plan * 100;
	try {
	  await sql`
	  INSERT INTO customers (name, idCard, phone, ip, plan, connectionType, sector, location, rb, status, balance)
	  VALUES (${name}, ${idCard}, ${phone}, ${ip}, ${planInCent}, ${connectionType}, ${sector}, ${location}, ${rb}, 'active', 0)
	  `;
	} catch (error) {
	  return {
		message: 'Database Error: Failed to Create Customer.',
	  };
	}
  
	revalidatePath('/dashboard/customers');
	redirect('/dashboard/customers');
  }
  
//   export async function CreateCustomerFiber(
// 	prevState: StateCustomerFiber,
// 	formData: FormData,
//   ) {
// 	const validatedFields = CustomerFiber.safeParse({
// 	  name: formData.get('name'),
// 	  idCard: formData.get('idCard'),
// 	  phone: formData.get('phone'),
// 	  ip: formData.get('ip'),
// 	  plan: formData.get('plan'),
// 	  connectionType: formData.get('connectionType'),
// 	  sector: formData.get('sector'),
// 	  location: formData.get('location'),
// 	  rb: formData.get('rb'),
// 	  box: formData.get('box'),
// 	  port: formData.get('port'),
// 	});
  
// 	if (!validatedFields.success) {
// 	  return {
// 		errors: validatedFields.error.flatten().fieldErrors,
// 		message: 'Campos faltantes. No se pudo crear el cliente.',
// 	  };
// 	}
// 	const {
// 	  name,
// 	  connectionType,
// 	  idCard,
// 	  phone,
// 	  ip,
// 	  plan,
// 	  sector,
// 	  location,
// 	  rb,
// 	  box,
// 	  port,
// 	} = validatedFields.data;
  
// 	const planInCent = plan * 100;
  
// 	try {
// 	  await sql`
// 	  INSERT INTO customers (name, idCard, phone, ip, plan, connectionType, sector, location, rb, box, port)
// 	  VALUES (${name}, ${idCard}, ${phone}, ${ip}, ${planInCent}, ${connectionType}, ${sector}, ${location}, ${rb}, ${box}, ${port})
// 	  `;
// 	} catch (error) {
// 	  return {
// 		message: 'Database Error: Failed to Create Customer.',
// 	  };
// 	}
  
// 	revalidatePath('/dashboard/customers');
// 	redirect('/dashboard/customers');
//   }
  