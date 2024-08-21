import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Switch 
} from "@material-tailwind/react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { editar } from "../servicios/editar";
const apiUrl = import.meta.env.VITE_API_URL;
export function PermisosRolModal(id_rol) {
  const [size, setSize] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [permiso, setPermiso] = useState([]);


  // Divide el array de permisos en dos
  const mitad = Math.ceil(permiso.length / 2);
  const permisoPrimeraMitad = permiso.slice(0, mitad);
  const permisoSegundaMitad = permiso.slice(mitad);
  const handleOpen = () => setOpen(!open);

  const handleSwitchChange = (index, acceso) => {
    // Crea una copia del estado de permiso
    const newPermiso = [...permiso];
  
    // Actualiza el valor de acceso en el índice correspondiente
    newPermiso[index].acceso = acceso ? 1 : 0;
  
    // Actualiza el estado de permiso
    setPermiso(newPermiso);
  };

  useEffect(() => {
    if (open) {
      fetch(`${apiUrl}/consultar_permisos_rol/${id_rol.id_rol}`)
        .then(response => response.json())
        .then(data => setPermiso(data));
    }
  }, [open, id_rol]);





  const manejarEnvio = async (event) => {
    event.preventDefault();
  
    // Aquí asumimos que tienes un estado de React que contiene los permisos actuales
    const data = permiso.map(item => ({
      id_modulo: item.id_modulo,
      acceso: item.acceso ? 1 : 0, // Convierte el valor booleano a 1 o 0
    }));
  
    // Aquí puedes validar tus datos si tienes un esquema de validación
     
  
    try {
      const respuesta = await editar(`${apiUrl}/actualizar_permisos_rol/`, data, id_rol.id_rol);
      console.log(data);
      if (respuesta.estado) {
        Swal.fire('Actualizado!', respuesta.msg, 'success');
        onUpdatePermiso(id_rol, data); // Actualiza los permisos en el componente padre
        setOpen(false);
      } else {
        Swal.fire('Error!', respuesta.msg, 'error');
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <>
      <div className=" flex mx-2">
        <Button color="green" onClick={handleOpen} variant="gradient" className="flex">
          <Cog6ToothIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
      <Dialog
        open={open}
        size={size || "md"}
        handler={handleOpen}
      >
        <DialogHeader>Editar permisos</DialogHeader>
        <DialogBody>
          <div class="relative flex flex-col w-[100%] h-[100%]  text-gray-700 bg-white rounded-xl">
            <table class="w-[100%] text-left  min-w-[100%] mb-12">
              <thead>
                <tr>
                  <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Modulo
                    </p>
                  </th>
                  <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Ver
                    </p>
                  </th>
                  <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Modulo
                    </p>
                  </th>
                  <th class="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p class="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Ver
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
              {permisoPrimeraMitad.map((item, index) => (
  <tr key={index}>
    <td class="p-4 border-b border-blue-gray-50">
      <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
        {item.titulo}
      </p>
    </td>
    <td class="p-4 border-b border-blue-gray-50">
      <Switch color="green" defaultChecked={item.acceso === 1} onChange={(e) => handleSwitchChange(index, e.target.checked)} />
    </td>
    {permisoSegundaMitad[index] && (
      <>
        <td class="p-4 border-b border-blue-gray-50">
          <p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {permisoSegundaMitad[index].titulo}
          </p>
        </td>
        <td class="p-4 border-b border-blue-gray-50">
          <Switch color="green" defaultChecked={permisoSegundaMitad[index].acceso === 1} onChange={(e) => handleSwitchChange(index + mitad, e.target.checked)} />
        </td>
      </>
    )}
  </tr>
))}
              </tbody>
            </table>
          </div> 
          <div className="">
  <Button
    variant="gradient"
    color="green"
    onClick={(event) => {
      manejarEnvio(event);
      handleOpen(null);
    }}
  >
    <span>Confirmar</span>
  </Button>
</div>

        </DialogBody>
      </Dialog>
    </>
  );
}