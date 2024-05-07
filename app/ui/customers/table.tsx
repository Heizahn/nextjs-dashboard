import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  CustomerField,
} from '@/app/lib/definitions';
import {
  CreateCustomer,
  DeleteCustomer,
  PayCustomer,
  UpdateCustomer,
} from './buttons';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default async function CustomersTable({
  customers,
}: {
  customers: CustomerField[];
}) {
  return (
    <div className="w-full ">
      <header className='sticky top-0 z-10 bg-white pt-6'>
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Clientes
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      </header>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {customers?.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {customer.idcard}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Plan</p>
                        <p className="font-medium">{customer.plan.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",")}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Saldo</p>
                        <p className="font-medium">{customer.balance === 0 ? customer.balance.toFixed(2).replace(".",",") : customer.balance.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",")}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>Sector: <span className="font-medium px-4 ">{customer.sector.replace(customer.sector[0], customer.sector[0].toUpperCase())}</span></p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th></th>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Cliente
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Cedula
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Plan
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      IP
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Sector
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Ubicación
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Tipo de conexion
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Saldo
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="group">
                      <td className='whitespace-nowrap bg-white px-4 py-5'>
                        {customer.status === 'active' ? <div className='w-3 h-3 rounded-full bg-green-500'></div> : customer.status === 'moroso' ? <div className='w-3 h-3 rounded-full bg-orange-500'></div> : <div className='w-3 h-3 rounded-full bg-red-500'></div>}
                      </td>
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {customer.idcard}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {/** Convert amount from cents to dollars */}
                        {customer.plan.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ' USD'}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <Link target='_blank' href={`http://${customer.ip}`}>{customer.ip} </Link>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {customer.sector.replace(customer.sector[0], customer.sector[0].toUpperCase())}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        <Link className='flex justify-center' target='_blank' href={`https://maps.app.goo.gl/${customer.location}`}><MapPinIcon  className='w-6'/></Link>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {(customer.connectiontype).replace(customer.connectiontype[0], customer.connectiontype[0].toUpperCase())}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {customer.balance.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ' USD'}
                      </td>
                      <td className="whitespace-nowrap bg-white py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <PayCustomer id={customer.id} />
                          <UpdateCustomer id={customer.id} />
                          <DeleteCustomer id={customer.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
