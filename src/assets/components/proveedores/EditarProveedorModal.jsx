import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { editar } from "../servicios/editar";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { proveedorSchema } from "./ProveedoresValidaciones";
const apiUrl = import.meta.env.VITE_API_URL;
export function EditarProveedorModal({ id_proveedor, onUpdateProveedor }) {
  const [open, setOpen] = useState(false);
  const [proveedor, setProveedor] = useState(null);
  const [errors, setErrors] = useState({});

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    if (open) {
      fetch(`${apiUrl}/consultar_proveedor/${id_proveedor}`)
        .then(response => response.json())
        .then(data => setProveedor(data))
        .catch(error => console.error('Error fetching proveedor:', error));
    }
  }, [open, id_proveedor]);

  const manejarEnvio = async (event) => {
    event.preventDefault();
  
    const data = {
      nombre_empresa: event.target.elements.nombre_empresa.value,
      telefono_contacto: event.target.elements.telefono_contacto.value,
      nit: event.target.elements.nit.value,
      sello: event.target.elements.sello.value,
      cedula: event.target.elements.cedula.value,
      direccion: event.target.elements.direccion.value,
    };

    const result = proveedorSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      return; // Detener la ejecución si hay errores de validación
    }

    try {
      const respuesta = await editar(`${apiUrl}/actualizar_proveedor/`, data, id_proveedor);
      if (respuesta.estado) {
        Swal.fire('Actualizado!', respuesta.msg, 'success');
        onUpdateProveedor(id_proveedor, data);
        setOpen(false);
      } else {
        Swal.fire('Error!', respuesta.msg, 'error');
        setOpen(false);
      }
    } catch (error) {
      console.error('Error updating provider:', error);
      Swal.fire('Error!', 'Hubo un problema al actualizar el proveedor. Por favor, intenta nuevamente.', 'error');
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
          <div class="relative flex-col text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border grid justify-items-center">
            <h4 class="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Editar Proveedor
            </h4>

            <form className="max-w-screen-lg mt-8 mb-2 w-full" onSubmit={manejarEnvio}>            
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-1">
                <div>
                <h6
                  class="block  font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Nombre Proveedor*
                </h6>
                <div class="relative h-11 w-full min-w-[200px]">
                <input 
                    name="nombre_empresa"
                    placeholder="Este Proveedor hace..." 
                    value={proveedor ? proveedor.nombre_empresa : ''} 
                    onChange={e => setProveedor({ ...proveedor, nombre_empresa: e.target.value })}
   
                    class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                />
                  <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                </div>
                {errors.nombre_empresa && <p style={{ color: 'red' }}>{errors.nombre_empresa[0]}</p>}
                </div>
                <div>
                <h6
                  class="block  font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Telefono Contacto*
                </h6>
                <div class="relative h-11 w-full min-w-[200px]">
                <input 
                    name="telefono_contacto"
                    placeholder="Este telefono es..." 
                    value={proveedor ? proveedor.telefono_contacto : ''} 
                    onChange={e => setProveedor({ ...proveedor, telefono_contacto: e.target.value })}
   
                    class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                />
                  <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                  {errors.telefono_contacto && <p style={{ color: 'red' }}>{errors.telefono_contacto[0]}</p>}
                </div>
                </div>
                <div>
                <h6
                  class="blockfont-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Nit
                </h6>
                <div class="relative h-11 w-full min-w-[200px]">
                <input 
                    name="nit"
                    placeholder="Este nit es..." 
                    value={proveedor ? proveedor.nit : ''} 
                    onChange={e => setProveedor({ ...proveedor, nit: e.target.value })}
   
                    class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                />
                  <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                  {errors.nit && <p style={{ color: 'red' }}>{errors.nit[0]}</p>}
                </div>
                </div>
                <div>
                <h6
                  class="block  font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Sello*
                </h6>
                <div class="relative h-11 w-full min-w-[200px]">
                <input 
                    name="sello"
                    placeholder="Este sello es..." 
                    value={proveedor ? proveedor.sello : ''} 
                    onChange={e => setProveedor({ ...proveedor, sello: e.target.value })}
   
                    class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                />
                  <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                    {errors.sello && <p style={{ color: 'red' }}>{errors.sello[0]}</p>}
                </div>
                </div>
                <div>
                <h6
                  class="block  font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Cedula*
                </h6>
                <div class="relative h-11 w-full min-w-[200px]">
                <input 
                    name="cedula"
                    placeholder="Esta cedula es..." 
                    value={proveedor ? proveedor.cedula : ''} 
                    onChange={e => setProveedor({ ...proveedor, cedula: e.target.value })}
   
                    class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                />
                  <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                    {errors.cedula && <p style={{ color: 'red' }}>{errors.cedula[0]}</p>}
                </div>
                </div>
                <div>
                <h6
                  class="block  font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Direccion*
                </h6>
                <div class="relative h-11 w-full min-w-[200px]">
                <input 
                    name="direccion"
                    placeholder="Esta direccion es..." 
                    value={proveedor ? proveedor.direccion : ''} 
                    onChange={e => setProveedor({ ...proveedor, direccion: e.target.value })}
   
                    class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" 
                />
                    {errors.direccion && <p style={{ color: 'red' }}>{errors.direccion[0]}</p>}
                  <label
                    class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                </div>
                </div>
              </div>
              <div class="inline-flex items-center">
              </div>
            
              <button 
                class="mt-6 block w-full select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="submit">
                Actualizar Proveedor  
              </button>
            </form>
          </div>
        </DialogBody>

      </Dialog>
    </>
  );
}