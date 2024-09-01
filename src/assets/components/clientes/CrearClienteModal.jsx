import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import { clienteSchema } from "./ClientesValidaciones";
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState } from 'react';
const enviarDatos = async (url, datos) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });
  return response.json();
};

export function CrearClienteModal({ onAddCategory }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [tipoUsuario, setTipoUsuario] = useState('natural');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('CC');
  const [tipoCliente, setTipoCliente] = useState('unitario');  // Estado para tipo_cliente
  
  const manejarEnvio = async (event) => {
    event.preventDefault();
    const datos = {
      nombre_cliente: event.target.elements.nombre_cliente.value,
      contacto: event.target.elements.contacto?.value,
      id: event.target.elements.id.value,
      correo: event.target.elements.correo.value,
      telefono: event.target.elements.telefono.value,
      clave: event.target.elements.clave.value,
      confirmar_clave: event.target.elements.confirmar_clave.value,
      tipo_identificacion: event.target.elements.tipo_identificacion.value,
      tipo_usuario: event.target.elements.tipo_usuario.value,
      tipo_cliente: event.target.elements.tipo_cliente.value,  // Nuevo campo tipo_cliente
      estado: '1',
    };

    const result = clienteSchema.safeParse(datos);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      console.log(fieldErrors);
    } else {
      setErrors({});
      try {
        const respuesta = await enviarDatos(`${apiUrl}/crear_cliente`, datos);
        if (respuesta.estado) {
          Swal.fire({
            title: 'Agregado!',
            text: respuesta.msg,
            icon: 'success',
            footer: '<a href="/clientes" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">Ir a Inicio</a>',
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Agregado!',
            text: respuesta.msg,
            icon: 'error',
            footer: '<a href="/clientes" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">Ir a Inicio</a>',
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTipoUsuarioChange = (event) => {
    const newTipoUsuario = event.target.value;
    setTipoUsuario(newTipoUsuario);

    if (newTipoUsuario === 'juridico') {
      setTipoIdentificacion('NIT');
    } else {
      setTipoIdentificacion('CC');
    }
  };

  return (
    <>
     <Button color="green" onClick={() => setOpen(true)} variant="gradient" className="flex">
        <UserPlusIcon className="h-5 w-5" />  
        <span className="px-2">Nuevo Cliente</span>
      </Button>
      <Dialog
        open={open}
        handler={() => setOpen(!open)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody className="h-[42rem] overflow-scroll">
            <form onSubmit={manejarEnvio} className="max-w-4xl mx-auto bg-white shadow-[0_2px_18px_-3px_rgba(6,81,237,0.4)] sm:p-8 p-4 rounded-md">
              <div className="grid md:grid-cols-2 gap-y-7 gap-x-12">
                <div>
                  <label className="text-sm mb-2 block">Tipo de usuario*</label>
                  <select
                    name="tipo_usuario"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    value={tipoUsuario}
                    onChange={handleTipoUsuarioChange}
                  >
                    <option value="natural">Natural</option>
                    <option value="juridico">Juridico</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm mb-2 block">Tipo de Identificación*</label>
                  {tipoUsuario === 'natural' ? (
                    <select
                      name="tipo_identificacion"
                      className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                      value={tipoIdentificacion}
                      onChange={(e) => setTipoIdentificacion(e.target.value)}
                    >
                      <option value="CC">Cédula</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="TI">Tarjeta de Identidad</option>
                    </select>
                  ) : (
                    <input
                      name="tipo_identificacion"
                      type="text"
                      className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                      value="NIT"
                      readOnly
                    />
                  )}
                </div>
                <div>
                  <label className="text-sm mb-2 block">Tipo de Cliente*</label>
                  <select
                    name="tipo_cliente"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    value={tipoCliente}
                    onChange={(e) => setTipoCliente(e.target.value)}
                  >
                    <option value="unitario">Unitario</option>
                    <option value="mayorista">Mayorista</option>
                  </select>
                  {errors.tipo_cliente && <p className="text-red-500 text-xs mt-1">{errors.tipo_cliente}</p>}
                </div>
                <div>
                  <label className="text-sm mb-2 block">Nombre*</label>
                  <input name="nombre_cliente" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Ingresa tu nombre" />
                  {errors.nombre_cliente && <p className="text-red-500 text-xs mt-1">{errors.nombre_cliente}</p>}
                </div>
                <div>
                  <label className="text-sm mb-2 block">Número de identificación*</label>
                  <input
                    name="id"
                    type="text"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder={tipoUsuario === 'juridico' ? 'NIT' : 'Ingresa tu cédula'}
                  />
                  {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
                </div>
              
                <div>
                  <label className="text-sm mb-2 block">Número de Teléfono*</label>
                  <input name="telefono" type="tel" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Ingresa tu número de teléfono" />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>
                {tipoUsuario === 'juridico' && (
                  <div>
                    <label className="text-sm mb-2 block">Contacto*</label>
                    <input name="contacto" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Ingresa tu contacto" />
                    {errors.contacto && <p className="text-red-500 text-xs mt-1">{errors.contacto}</p>}
                  </div>
                )}
                <div>
                  <label className="text-sm mb-2 block">Correo*</label>
                  <input name="correo" type="email" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Ingresa tu correo" />
                  {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                </div>
                <div>
                  <label className="text-sm mb-2 block">Contraseña*</label>
                  <input name="clave" type="password" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Ingresa tu contraseña" />
                  {errors.clave && <p className="text-red-500 text-xs mt-1">{errors.clave}</p>}
                </div>
                <div>
                  <label className="text-sm mb-2 block">Confirmar Contraseña*</label>
                  <input name="confirmar_clave" type="password" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Confirma tu contraseña" />
                  {errors.confirmar_clave && <p className="text-red-500 text-xs mt-1">{errors.confirmar_clave}</p>}
                </div>
               
              </div>
              <div className="!mt-10 flex justify-center">
                <button type="submit" className="min-w-[150px] py-3 px-4 text-sm font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
                  Crear Cliente 
                </button>
              </div>
            </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
