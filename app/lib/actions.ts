'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Por favor seleccione un cliente.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Por favor ingrese un monto como $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Por favor seleccione el estado d e la factura',
  }),
  date: z.string(),
});

const FormSchemaCustomer = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Por favor ingrese un nombre para el cliente.'
  }),
  idCard: z.string({
    invalid_type_error: 'Por favor ingrese la cedula del cliente.'
  }),
  phone: z.string({
    invalid_type_error: 'Por favor ingrese el numero de telefono.'
  }),
  ip: z.string({
    invalid_type_error: 'Por favor ingrese el numero de telefono.'
  }),
  plan: z.coerce
  .number()
  .gt(0, { message: 'Por favor ingrese un monto como $0.' }),
  connectionType: z.string({
    invalid_type_error: 'Por favor seleccione el tipo de conexion.'
  }),
  sector: z.string({
    invalid_type_error: 'Por favor ingrese el sector.'
  }),
  location: z.string({
    invalid_type_error: 'Por favor ingrese La ubicación.'
  }),
  rb: z.string({
    invalid_type_error: 'Por favor seleccione un Router.'
  }),
  box: z.string({
    invalid_type_error: 'Por favor seleccione una Caja.'
  }),
  port: z.string({
    invalid_type_error: 'Por favor seleccione un Puerto.'
  })
})

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message: string | null;
};

export type StateCustomer = {
  error?: {
    name?: string[];
    idCard?: string[];
    phone?: string[];
    ip?: string[];
    plan?: string[];
    connectionType?: string[];
    sector?: string[];
    location?: string[];
    rb?: string[];
    box?: string[];
    port?: string[];
};
  message: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateCustomer = FormSchemaCustomer.omit({id: true});

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo crear la factura.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (err) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo actualizar la factura.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (err) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (err) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales Invalidas.';
        default:
          return 'Algo salió mal.';
      }
    }
  }
}

export async function createCustomer(prevState: StateCustomer, formData: FormData){
   const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    idCard: formData.get('idCard'),
    phone: formData.get('phone'),
    ip: formData.get('ip'),
    plan: formData.get('plan'),
    connectionType: formData.get('connectionType'),
    sector: formData.get('sector'),
    location: formData.get('location'),
    rb: formData.get('rb')
   })

   if(!validatedFields.success){
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo crear el cliente.'
    }
   }

   console.log(validatedFields.data)

   const {name, idCard, phone, ip, plan, connectionType, sector, location, rb} = validatedFields.data

   const validatedBoxPort = CreateCustomer.safeParse({
    box: formData.get('box'),
    port: formData.get('port')
   })
   const planInCent = plan * 100

   try {

    if(validatedBoxPort.success){

      const {box, port} = validatedBoxPort.data
      await sql`
      INSERT INTO customers (name, idCard, phone, ip, plan, connectionType, sector, location, rb, box, port)
      VALUES (${name}, ${idCard}, ${phone}, ${ip}, ${planInCent}, ${connectionType}, ${sector}, ${location}, ${rb}, ${box}, ${port})
    `;
    } else {
      await sql`
        INSERT INTO customers (name, idCard, phone, ip, plan, connectionType, sector, location, rb)
        VALUES (${name}, ${idCard}, ${phone}, ${ip}, ${planInCent}, ${connectionType}, ${sector}, ${location}, ${rb})
      `;
    }
   } catch(err){
    return {
      message: 'Database Error: Failed to Create Customer.',
    };
   }

   revalidatePath('/dashboard/customers');
   redirect('/dashboard/customers')
}