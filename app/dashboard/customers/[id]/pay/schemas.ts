
import { z } from 'zod';

export type StatePay = {
	errors?: {
	  customerId?: string[];
	  amount?: string[];
	  method?: string[]
	  invoiceId?: string[]
	};
	message: string | null;
  };

export const PaySchema = z.object({
	id: z.string(),
	customerId: z.string(),
	invoiceId: z.string(),
	amount: z.coerce.number().gt(0, { message: 'Por favor ingrese un monto.' }),
	method: z.enum(['Pago Móvil', 'Divisa Efectivo', 'Efectivo Nacional'], {
	  invalid_type_error: 'Por favor seleccione el método de pago.',
	}),
	date: z.string(),
  });

export type PaymentCredit = {
	id_customer: string, 
	amount: number,
	date: string
}