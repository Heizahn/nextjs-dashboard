'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { CreateCustomerWireless, CreateCustomerFiber } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

const CreateCustomer = () => {
  const [tipoConexion, setTipoConexion] = useState('');
  const initialState = { message: null, errors: {} };


  const [state, dispatch] = useFormState(CreateCustomerWireless, initialState);

  console.log(state);
  return (
    <form action={dispatch} className="grid grid-cols-1 gap-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            defaultValue={''}
            aria-describedby="customer-error"
          />
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.error?.name &&
              state.error.name.map((err) => (
                <p className="mt-2 text-sm text-red-500" key={err}>
                  {err}
                </p>
              ))}
          </div>
        </div>

        <div>
          <label htmlFor="idCard">Cédula:</label>
          <input
            type="text"
            id="idCard"
            name="idCard"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="ip">IP:</label>
          <input
            type="text"
            id="ip"
            name="ip"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="plan">Plan:</label>
          <select
            id="plan"
            name="plan"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            defaultValue=""
            aria-describedby="customer-error"

          >
            {tipoConexion === 'fibra' ? (
              <>
                {' '}
                <option value="">Selecciona</option>
                <option value="25">$25 - 60Mb</option>
                <option value="30">$30 - 100Mb</option>{' '}
              </>
            ) : (
              <>
                <option value="">Selecciona</option>
                <option value="20">$20 - 8Mb</option>
                <option value="25">$25 - 12Mb</option>
                <option value="30">$30 - 20Mb</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="connectionType">Tipo de conexión:</label>
          <select
            id="connectionType"
            name="connectionType"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            onChange={(e) => setTipoConexion(e.target.value)}
            defaultValue=""
          >
            <option value="">Selecciona</option>
            <option value="fibra">Fibra</option>
            <option value="antena">Antena</option>
          </select>
        </div>

        <div>
          <label htmlFor="sector">Sector:</label>
          <input
            type="text"
            id="sector"
            name="sector"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="location">Ubicación:</label>
          <input
            type="text"
            id="location"
            name="location"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            defaultValue={''}
          />
        </div>

        <div>
          <label htmlFor="rb">Router:</label>
          <select
            id="rb"
            name="rb"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            defaultValue={''}
          >
            {tipoConexion === 'fibra' ? (
              <>
                {' '}
                <option value="">Selecciona</option>
                <option value="0.0.0.0">4011C</option>
              </>
            ) : (
              <>
                <option value="">Selecciona</option>
                <option value="192.168.217.1">RB705LV</option>
              </>
            )}
          </select>
        </div>
        {tipoConexion === 'fibra' && (
          <>
            <div>
              <label htmlFor="box">Caja:</label>
              <select
                id="box"
                name="box"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                defaultValue={''}
              >
                <option value="">Selecciona</option>
                <option value="1T">1T</option>
                <option value="2T">2T</option>
                <option value="3T">3T</option>
                <option value="4T">4T</option>
                <option value="5T">5T</option>
                <option value="6T">6T</option>
                <option value="7T">7T</option>
                <option value="8T">8T</option>
                <option value="1V">1V</option>
                <option value="2V">2V</option>
                <option value="3V">3V</option>
                <option value="4V">4V</option>
                <option value="5V">5V</option>
                <option value="6V">6V</option>
                <option value="7V">7V</option>
                <option value="8V">8V</option>
              </select>
            </div>
            <div>
              <label htmlFor="port">Puerto:</label>
              <select
                id="port"
                name="port"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              >
                <option value="">Selecciona</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Cliente</Button>
      </div>

      {
        <div id="customer-error" aria-live="polite" aria-atomic="true">
          {state.message && (
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
        </div>
      }
    </form>
  );
};

export default CreateCustomer;
