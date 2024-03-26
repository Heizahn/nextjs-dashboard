'use client';
import { useState } from 'react';

const CreateCustomer = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica para enviar los datos del formulario
  };

  const [tipoConexion, setTipoConexion] = useState('');
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="cedula">Cédula:</label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
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
          >
            {tipoConexion === 'fibra' ? (
              <>
                {' '}
                <option value="25">$25 - 60Mb</option>
                <option value="30">$30 - 100Mb</option>{' '}
              </>
            ) : (
              <>
                <option value="20">$20 - 8Mb</option>
                <option value="25">$25 - 12Mb</option>
                <option value="30">$30 - 20Mb</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="tipo-conexion">Tipo de conexión:</label>
          <select
            id="tipo-conexion"
            name="tipo-conexion"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            onChange={(e) => setTipoConexion(e.target.value)} // Actualiza el estado al cambiar la selección
          >
            <option value="">Selecciona una opción</option>
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
          <label htmlFor="coordenadas">Ubicación:</label>
          <input
            type="text"
            id="coordenadas"
            name="coordenadas"
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        {tipoConexion === 'fibra' && (
          <>
            <div>
              <label htmlFor="caja">Caja:</label>
              <select
                id="caja"
                name="caja"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              >
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
              <label htmlFor="puerto">Puerto:</label>
              <select
                id="puerto"
                name="puerto"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              >
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
      <div>
        <button
          type="submit"
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};

export default CreateCustomer;
