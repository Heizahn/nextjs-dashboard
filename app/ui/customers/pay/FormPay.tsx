'use client'

import { CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { addPayment } from '@/app/lib/actions/actionsBalance';
import Link from 'next/link';

export function FormPay({id, nameCustomer, invoices}: {id: string, invoices: any, nameCustomer: string}) {

	const initialState = {message: null, errors: {}};
	const [state, dispatch] = useFormState(addPayment, initialState);

	return (
		<form action={dispatch}>
		<div className="rounded-md bg-gray-50 p-4 md:p-6">
		  {/* Customer ID */}
		  <div className="mb-4">
			<label htmlFor="customer" className="mb-2 block text-sm font-medium">
			  ID del cliente
			</label>
			<div className="relative mt-2 rounded-md">
				<div className='flex items-center'>

				<UserIcon className="pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
				  <span className='ml-6 text-gray-900 font-medium text-lg'>{nameCustomer}</span>
				</div>
				
			  <div className="relative">
				<input
				  id="customer"
				  name="customer"
				  type="text"
				  placeholder="ID del cliente"
				  defaultValue={id}
				  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 hidden"
				  aria-describedby="customer-error"
				  readOnly
				/>
				
			  </div>
			  <div id="customer-error" aria-live="polite" aria-atomic="true">
				{state.errors?.customerId &&
				  state.errors.customerId.map((err) => (
					<p className="text-sm text-red-600" key={err}>
					  {err}
					</p>
				  ))
				}
			  </div>
			</div>
		  </div>

		  {/* Invoice Selected */}
		  <div className="mb-4">
			<label htmlFor="invoice" className="mb-2 block text-sm font-medium">
			  Selecciona una Factura
			</label>
			<div className="relative mt-2 rounded-md">
			  <div className="relative">
				<select
				  id="invoice"
				  name="invoice"
				  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 text-[16px]"
				  aria-describedby="invoice-error"
				>
				  {invoices.map((invoice: any) => (
					<option key={invoice.id} value={invoice.id} className='text-gray-800 text-lg'>
					  {invoice.reason}
					</option>
				  ))}
				</select>
				<CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
			  </div>
			  <div id="invoice-error" aria-live="polite" aria-atomic="true">
				{state.errors?.invoiceId &&
				  state.errors.invoiceId.map((err) => (
					<p className="text-sm text-red-600" key={err}>
					  {err}
					</p>
				  ))
				}
			  </div>
			</div>
		  </div>
		  {/* Payment Amount */}
		  <div className="mb-4">
			<label htmlFor="amount" className="mb-2 block text-sm font-medium">
			  Monto
			</label>
			<div className="relative mt-2 rounded-md">
			  <div className="relative">
				<input
				  id="amount"
				  name="amount"
				  type="number"
				  step="0.01"
				  placeholder="Solo Monto en USD"
				  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
				  aria-describedby="customer-error"
				/>
				<CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
			  </div>
			  <div id="customer-error" aria-live="polite" aria-atomic="true">
				{state.errors?.amount &&
				  state.errors.amount.map((err) => (
					<p className="mt-2 text-sm text-red-500" key={err}>
					  {err}
					</p>
				  ))}
			  </div>
			</div>
		  </div>
  
		  {/* Payment Method */}
		  <fieldset className="mb-4">
			<legend className="mb-2 block text-sm font-medium">
			  Forma de pago
			</legend>
			<div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
			  <div className="flex gap-4">
				<div className="flex items-center">
				  <input
					id="pago_movil"
					name="method"
					type="radio"
					value="Pago Móvil"
					className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
					aria-describedby="customer-error"
				  />
				  <label
					htmlFor="pago_movil"
					className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
				  >
					Pago Móvil
				  </label>
				</div>
				<div className="flex items-center">
				  <input
					id="divisa_efectivo"
					name="method"
					type="radio"
					value="Divisa Efectivo"
					className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
					
				  />
				  <label
					htmlFor="divisa_efectivo"
					className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
				  >
					Divisa Efectivo
				  </label>
				</div>
				<div className="flex items-center">
				  <input
					id="efectivo_nacional"
					name="method"
					type="radio"
					value="Efectivo Nacional"
					className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
				  />
				  <label 
					htmlFor="efectivo_nacional"
					className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
				  >
					Efectivo Nacional
				  </label>
				</div>
			  </div>
			</div>
			<div id="customer-error" aria-live="polite" aria-atomic="true">
			  {state.errors?.method &&
				state.errors.method.map((err) => (
				  <p className="mt-2 text-sm text-red-500" key={err}>
					{err}
				  </p>
				))}
			</div>
		  </fieldset>
		</div>
  
		{/* Submit Button */}
		<div className="mt-6 flex justify-end gap-4">
		  <Link
			href="/dashboard/customers"
			className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
		  >
			Cancelar
		  </Link>
		  <Button type="submit">Crear Pago</Button>
		</div>
	  </form>
	)
}