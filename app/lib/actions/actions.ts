'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { updateBalanceInvoice } from './actionsBalance';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    reason?: string[]
  };
  message: string | null;
};




const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Por favor seleccione un cliente.',
  }),
  amount: z.coerce.number().gt(0, { message: 'Por favor seleccione el plan' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Por favor seleccione el estado d e la factura',
  }),
  reason: z.string(), 
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });


export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo crear la factura.',
    };
  }

  const { customerId, amount, status, reason } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date, reason)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${reason})
    `;

    const credit = (await sql`SELECT * FROM paymentcredit WHERE id_customer = ${customerId}`).rows[0];

    if (credit) {
      const invoice = (await sql`SELECT * FROM invoices WHERE date = ${date} AND customer_id = ${customerId}`).rows[0]

      if (credit.amount >= invoice.amount){
        await sql`UPDATE invoices SET status = 'paid' WHERE id = ${invoice.id}`
        let result = credit.amount - invoice.amount

        if (result > 0) {
          await sql`DELETE FROM paymentcredit WHERE id_customer = ${customerId}`

          await sql`INSET INTO paids (id_customer, amount, date,) VALUES (${customerId}, ${result}, ${date})`
        } else if (result === 0) {
          await sql`DELETE FROM paymentcredit WHERE id_customer = ${customerId}`
        }
      }
    }

    await updateBalanceInvoice(amount, customerId, status);
    const reasonWords = reason?.toLowerCase().split(' ')

    if (reasonWords.includes('mensualidad') && status === 'pending') {
      await sql`
        UPDATE customers
        SET status = 'moroso'
        WHERE id = ${customerId}
      `;
    }

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
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo actualizar la factura.',
    };
  }

  const { customerId, amount, status, reason } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, reason = ${reason}
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
