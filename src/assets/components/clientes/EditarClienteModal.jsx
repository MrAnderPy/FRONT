import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import { clienteSchema } from "./ClientesValidaciones";
import { editar } from "../servicios/editar";
const apiUrl = import.meta.env.VITE_API_URL;
export function EditarClienteModal({ id_cliente, onUpdateCategory }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState('natural');
  const [tipoIdentificacion, setTipoIdentificacion] = useState('CC');
  const [tipoCliente, setTipoCliente] = useState('unitario');

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    if (open) {
      const fetchCliente = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${apiUrl}/consultar_cliente/${id_cliente}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Error al obtener los datos del cliente');
          }
          const data = await response.json();
          setCliente(data);
          setTipoUsuario(data.tipo_usuario || 'natural');
          setTipoIdentificacion(data.tipo_identificacion || 'CC');
          setTipoCliente(data.tipo_cliente || 'unitario');
        } catch (error) {
          console.error('Error fetching client:', error);
          setError('Hubo un problema al obtener los datos del cliente. Por favor, inténtalo de nuevo.');
        }
      };

      fetchCliente();
    }
  }, [open, id_cliente]);

  const manejarEnvio = async (event) => {
    event.preventDefault();

    const data = {
      nombre_cliente: event.target.elements.nombre_cliente.value,
      id: event.target.elements.id.value,
      contacto: tipoUsuario === 'juridico' ? event.target.elements.contacto?.value : null,
      telefono: event.target.elements.telefono.value,
      correo: event.target.elements.correo.value,
      tipo_identificacion: event.target.elements.tipo_identificacion.value,
      tipo_usuario: tipoUsuario,
      tipo_cliente: tipoCliente,
    };

    const result = clienteSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    try {
      const respuesta = await editar(`${apiUrl}/actualizar_cliente/`, data, id_cliente);
      if (respuesta.estado) {
        Swal.fire({
          title: 'Actualizado!',
          icon: 'success',
          text: respuesta.msg,
          footer: '<a href="/clientes" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">OK</a>',
          showConfirmButton: false
        });
        onUpdateCategory(id_cliente, data);
        setOpen(false);
      } else {
        Swal.fire('Error!', respuesta.msg, 'error');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      Swal.fire('Error!', 'Hubo un problema al actualizar el cliente. Por favor, intenta nuevamente.', 'error');
      setOpen(false);
    }
  };

  return (
    <>
      <Button color="blue" onClick={handleOpen} className="p-3 m-1">
        <PencilSquareIcon strokeWidth={2} className="h-4 w-4" />
      </Button>

      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody>
          <div className="relative flex-col text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border grid justify-items-center">
            <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Editar cliente
            </h4>

            <form className="max-w-screen-lg mt-8 mb-2 w-full" onSubmit={manejarEnvio}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-1">
                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Tipo de usuario*
                  </h6>
                  <select
                    name="tipo_usuario"
                    value={tipoUsuario}
                    disabled// Deshabilitar el selector
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  >
                    <option value="natural">Natural</option>
                    <option value="juridico">Juridico</option>
                  </select>
                </div>

                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Tipo de Identificación*
                  </h6>
                  <select
                    name="tipo_identificacion"
                    value={tipoIdentificacion}
                     // Deshabilitar el selector
                    onChange={(e) => setTipoIdentificacion(e.target.value)}
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  >
                    {tipoUsuario === 'natural' ? (
                      <>
                        <option value="CC">Cédula</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="TI">Tarjeta de Identidad</option>
                      </>
                    ) : (
                      <option value="NIT">NIT</option>
                    )}
                  </select>
                </div>
                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Tipo de cliente*
                  </h6>
                  <select
                    name="tipo_cliente"
                    value={tipoCliente}
                    onChange={(e) => setTipoCliente(e.target.value)}
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                  >
                    <option value="unitario">Unitario</option>
                    <option value="mayorista">Mayorista</option>
                  </select>
                  {errors.tipo_cliente && <p className="text-red-500 text-xs mt-1">{errors.tipo_cliente}</p>}
                </div>

                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Nombre*
                  </h6>
                  <input 
                    name="nombre_cliente"
                    type="text"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder="Nombre del cliente" 
                    value={cliente ? cliente.nombre_cliente : ''} 
                    onChange={e => setCliente({ ...cliente, nombre_cliente: e.target.value })}
                  />
                  {errors.nombre_cliente && <p className="text-red-500 text-xs mt-1">{errors.nombre_cliente}</p>}
                </div>

                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Número de identificación*
                  </h6>
                  <input 
                    name="id"
                    type="text"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder={tipoUsuario === 'juridico' ? 'NIT' : 'Cédula'} 
                    value={cliente ? cliente.id : ''} 
                    disabled
                    onChange={e => setCliente({ ...cliente, id: e.target.value })}
                  />
                  {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
                </div>

                {tipoUsuario === 'juridico' && (
                  <div>
                    <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                      Contacto*
                    </h6>
                    <input 
                      name="contacto"
                      type="text"
                      className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                      placeholder="Contacto del cliente" 
                      value={cliente ? cliente.contacto : ''} 
                      onChange={e => setCliente({ ...cliente, contacto: e.target.value })}
                    />
                    {errors.contacto && <p className="text-red-500 text-xs mt-1">{errors.contacto}</p>}
                  </div>
                )}

                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Teléfono*
                  </h6>
                  <input 
                    name="telefono"
                    type="text"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder="Teléfono del cliente" 
                    value={cliente ? cliente.telefono : ''} 
                    onChange={e => setCliente({ ...cliente, telefono: e.target.value })}
                  />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>

                <div>
                  <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Correo electrónico*
                  </h6>
                  <input 
                    name="correo"
                    type="email"
                    className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                    placeholder="Correo del cliente" 
                    value={cliente ? cliente.correo : ''} 
                    onChange={e => setCliente({ ...cliente, correo: e.target.value })}
                  />
                  {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                </div>

               
              </div>

              <button 
                className="mt-6 block w-full select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="submit"
              >
                Actualizar cliente  
              </button>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
