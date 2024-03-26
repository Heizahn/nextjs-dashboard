
import CreateCustomer from '@/app/ui/customers/create-client';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
// import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
//   const customers = await fetchCustomers();

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
	  <CreateCustomer />
    </main>
  );
}
