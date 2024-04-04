"use client"
// import CreateCustomer from '@/app/ui/customers/create-client-wireless';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { useState } from 'react';
import NewCustomerWireless from '@/app/ui/customers/create-client-wireless';
import NewCustomerFiber from '@/app/ui/customers/create-client-fiber';
// import { fetchCustomers } from '@/app/lib/data';

export default function Page() {
//   const customers = await fetchCustomers();
const [ typeClient, setTypeClient] = useState('wireless')

  return (
    <main className='pt-6'>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          {
            label: 'Crear Cliente',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <select
      className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
      onChange={(e) => setTypeClient(e.target.value)}
      >
        <option value="wireless">Crear Cliente de Antena</option>
        <option value="fiber">Crear Cliente de Fibra</option>
      </select>

      {typeClient === "wireless"? 
        <NewCustomerWireless />
      :
        <NewCustomerFiber />
      }
    </main>
  );
}
