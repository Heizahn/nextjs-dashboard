import { z } from 'zod';

export type StateCustomerFiber = {
  errors?: {
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

export type StateCustomerWireless = {
  errors?: {
    name?: string[];
    idCard?: string[];
    phone?: string[];
    ip?: string[];
    plan?: string[];
    connectionType?: string[];
    sector?: string[];
    location?: string[];
    rb?: string[];
  };
  message: string | null;
};

export const FormSchemaCustomerWireless = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, { message: 'Por favor ingrese el nombre del cliente.' }),
  idCard: z.string().min(1, {
    message: 'Por favor ingrese la cedula del cliente.',
  }),
  phone: z.string().min(1, {
    message: 'Por favor ingrese el numero de telefono.',
  }),
  ip: z.string().min(1, {
    message: 'Por favor ingrese el numero de telefono.',
  }),
  plan: z.coerce.number().gt(0, { message: 'Por favor seleccione un plan.' }),
  connectionType: z.string(),
  sector: z.string().min(1, {
    message: 'Por favor ingrese el sector.',
  }),
  location: z.string().min(1, {
    message: 'Por favor ingrese La ubicación.',
  }),
  rb: z.string(),
});

export const FormSchemaCustomerFiber = z.object({
  id: z.string(),
  name: z.string().min(1, { 
	message: 'Por favor ingrese el nombre del cliente.' 
}),
  idCard: z.string().min(1, {
    message: 'Por favor ingrese la cedula del cliente.',
  }),
  phone: z.string().min(1, {
    message: 'Por favor ingrese el numero de telefono.',
  }),
  ip: z.string().min(1, {
    message: 'Por favor ingrese el numero de telefono.',
  }),
  plan: z.coerce.number().gt(0, { message: 'Por favor seleccione un plan.' }),
  connectionType: z.string(),
  sector: z.string().min(1, {
    message: 'Por favor ingrese el sector.',
  }),
  location: z.string().min(1, {
    message: 'Por favor ingrese La ubicación.',
  }),
  rb: z.string(),
  box: z.string().min(1, {
    message: 'Por favor seleccione un Caja.',
  }),
  port: z.string().min(1, {
    message: 'Por favor seleccione un Puerto.',
  }),
});
