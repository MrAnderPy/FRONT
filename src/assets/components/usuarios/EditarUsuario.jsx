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
import Swal from "sweetalert2";
import Select from "react-select";
import { usuarioSchema } from "./UsuariosValidaciones";
import { AuthContext } from "../../../AuthContext";
import { useContext } from "react";
import fetchData2 from "../servicios/fetchData2";
const apiUrl = import.meta.env.VITE_API_URL;
export function EditarUsuarioModal({ id_usuario, onUpdateUser }) {
  const { token } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [opcionesRoles, setOpcionesRoles] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [updatedUsuario, setUpdatedUsuario] = useState({
    tipo_identificacion: "",
    // otros campos de usuario
  });

  const handleTipoIdentificacionChange = (e) => {
    setUpdatedUsuario({
      ...updatedUsuario,
      tipo_identificacion: e.target.value,
    });
  };

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    if (open) {
      const fetchRoles = async () => {
        try {
          const data = await fetchData2(`${apiUrl}/consultar_roles`, token);
          const options = data.map((rol) => ({
            value: rol.id_rol,
            label: rol.nombre,
          }));
          setOpcionesRoles(options);
        } catch (error) {
          console.error("Error fetching roles data:", error);
        }
      };

      fetchRoles();
    }
  }, [open, token]);

  useEffect(() => {
    if (open) {
      const fetchUsuario = async () => {
        try {
          const data = await fetchData2(`${apiUrl}/consultar_usuario/${id_usuario}`, token);
          setUsuario(data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }; 
      
      fetchUsuario();
    }
  }, [open, id_usuario, token]);


  const manejarEnvio = async (event) => {
    event.preventDefault();
  
    const data = {
      nombre: event.target.elements.Nombre.value,
      apellido: event.target.elements.Apellido.value,
      correo: event.target.elements.Correo.value,
      clave: event.target.elements.Clave.value,
      cedula: event.target.elements.Cedula.value,
      telefono: event.target.elements.Telefono.value,
      id_rol: event.target.elements.nombre_rol.value,
      tipo_identificacion: updatedUsuario.tipo_identificacion,
    };
  
    const result = usuarioSchema.safeParse(data);
  
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
  
      // Map errors to the state
      const newErrors = {};
      Object.keys(fieldErrors).forEach((fieldName) => {
        newErrors[fieldName] = fieldErrors[fieldName].join(", ");
      });
  
      setErrors(newErrors);
      return;
    }
  
    // Clear errors if there are no validation issues
    setErrors({});
  
    try {
      const respuesta = await editar(
        `${apiUrl}/actualizar_usuario/`,
        data,
        id_usuario
      );
      if (respuesta.estado) {
        Swal.fire({
          title: 'Actualizado!',
          icon: 'success',
          text: respuesta.msg,
          footer: '<a href="/usuarios" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">OK</a>',
          showConfirmButton: false
        });
        onUpdateUser(id_usuario, data);
        setOpen(false);
      } else {
        Swal.fire('Error!', respuesta.msg, 'error');
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleRolChange = (selectedOption) => {
    if (usuario) {
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        id_rol: selectedOption ? selectedOption.value : "",
      }));
    }
  };
  return (
    <>
      <Button color="blue" onClick={handleOpen} className="p-2 m-1">
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
          <h4 className="font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 flex justify-center">
            Editar usuario
          </h4>
          <form onSubmit={manejarEnvio}>
            <div className="relative flex text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border justify-between">
              <div className="flex flex-col gap-6 mb-1 w-1/2 p-2">
              <div className="relative h-11 w-full min-w-[200px]">
                 <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Tipo de cliente*
                  </h6>
                 <select 
                  name="tipo_identificacion"
                  value={updatedUsuario.tipo_identificacion}
                  onChange={handleTipoIdentificacionChange}
                  className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                >
                  <option disabled value="">Seleccionar Tipo de Identificación</option>
                  <option value="CC">CC</option>
                  <option value="TI">TI</option>
                  <option value="CCE">CCE</option>
                </select>
                </div>
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Nombre del usuario*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    name="Nombre"
                    placeholder="Usuario"
                    value={usuario ? usuario.nombre : ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, nombre: e.target.value })
                    }
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                            
                            {errors.nombre && <p style={{ color: 'red', fontSize: '11px' }}>{errors.nombre}</p>}


                  </div>
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Apellido*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    name="Apellido"
                    placeholder="Usuario"
                    value={usuario ? usuario.apellido : ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, apellido: e.target.value })
                    }
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  {errors.apellido && (<p style={{ color: 'red', fontSize: '11px' }}>{errors.apellido[0]}</p>)}

                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                </div>
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Correo*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    name="Correo"
                    placeholder="usuario@batri.com"
                    value={usuario ? usuario.correo : ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, correo: e.target.value })
                    }
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                  {errors.correo && <p style={{ color: 'red', fontSize: '11px' }}>{errors.correo}</p>}
                </div>
                 
               
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                  hidden
                    name="Clave"
                    placeholder="*****"
                    value={usuario ? usuario.clave : ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, clave: e.target.value })
                    }
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                </div>
              </div>
              <div className="flex flex-col gap-6 mb-1 w-1/2 p-2">
              <div className="relative h-11 w-full min-w-[200px]">

              <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                    Tipo Rol*
                  </h6>
                  <Select
                    name="nombre_rol"
                    options={opcionesRoles}
                    value={
                      usuario
                        ? opcionesRoles?.find(
                            (option) => option.value === usuario.id_rol
                          )
                        : null
                    }
                    onChange={handleRolChange}
                    className="block  font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900"
                  />
                  </div>
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Cedula*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    name="Cedula"
                    placeholder="00000"
                    value={usuario ? usuario.cedula : ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, cedula: e.target.value })
                    }
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                  {errors.cedula && <p style={{ color: 'red', fontSize: '11px' }}>{errors.cedula}</p>}
                </div>
            

                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Telefono*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    name="Telefono"
                    placeholder="3..."
                    value={usuario ? usuario.telefono : ""}
                    onChange={(e) =>
                      setUsuario({ ...usuario, telefono: e.target.value })
                    }
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                </div>
                 
              </div>

              <div className="inline-flex items-center"></div>
            
            </div>
            <button
              className="block w-full select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="submit"
            >
              Guardar Usuario
            </button>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
