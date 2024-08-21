import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import Swal from 'sweetalert2';

import { usuarioSchema} from './UsuariosValidaciones';
import { enviarDatos } from '../servicios/crear'
import Select from 'react-select';
import { AuthContext } from "../../../AuthContext";
const apiUrl = import.meta.env.VITE_API_URL;
export function CrearUsuarioModal({onAddUser}) {
    const {token} = React.useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [rolesOptions, setRolesOptions] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
    const [tipoIdentificacion, setTipoIdentificacion] = useState('CC'); // Estado para tipo de identificación
    
    useEffect(() => {
        if (open) {
            setLoadingRoles(true);
            fetch(`${apiUrl}/consultar_roles`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((data) => {
                    //const rolesActivos = data.filter(rol => rol.estado === "Activo");
                    const options = data.map((rol) => ({
                        value: rol.id_rol,
                        label: rol.nombre
                    }));
                    setRolesOptions(options);
                    setLoadingRoles(false);
                })
                .catch((error) => {
                    console.error('Error fetching roles data:', error);
                    setLoadingRoles(false);
                });
        }
    }, [open]);

    const manejarEnvio = async (event) => {
        event.preventDefault();

        const datos = {
            nombre: event.target.elements.Nombre.value,
            apellido: event.target.elements.Apellido.value,
            correo: event.target.elements.Correo.value,
            clave: event.target.elements.Clave.value,
            cedula: event.target.elements.Cedula.value,
            telefono: event.target.elements.Telefono.value,
            id_rol: event.target.elements.nombre_rol.value,
            tipo_identificacion: tipoIdentificacion 
        };
    
        const result = usuarioSchema.safeParse(datos);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors);
        }else {
            setErrors({}); // Clear errors if validation passes 
          try {
            const respuesta = await enviarDatos(`${apiUrl}/crear_usuario`,datos);
            console.log(respuesta.msg); 
            console.log(respuesta.estado); 
            if(respuesta.estado){
              Swal.fire(
                'Agregado!',
                respuesta.msg,
                'success'
            );
            onAddUser(respuesta.data);  // Llamamos a la función pasada como prop
            setOpen(false);
            }
            else{
              Swal.fire(
                'Error!',
                respuesta.msg,
                'error'
            );
            setOpen(false);

            }
          } catch (error) {
            console.log(error);
          }
        }
    };

    const passwordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <Button color="green" onClick={() => setOpen(true)} variant="gradient" className="flex">
                <span className="px-2">Crear Usuario</span>
            </Button>
            <Dialog
                open={open}
                handler={() => setOpen(!open)}
                animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
                }}
            >
                <DialogBody>
                    <h4 className="font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 flex justify-center">
                        Registrar Usuario
                    </h4>
                    <form  onSubmit={manejarEnvio}>
                        <div className="relative flex text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border justify-between">
                            <div className="flex flex-col gap-6 mb-1 w-1/2 p-2">
                  
                            <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Tipo de Identificación*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <select
                    name="tipo_identificacion"
                    value={tipoIdentificacion}
                    onChange={(e) => setTipoIdentificacion(e.target.value)}
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-none disabled:border-0 disabled:bg-blue-gray-50"
                  >
                    <option value="CC">CC</option>
                    <option value="TI">TI</option>
                    <option value="CCE">CCE</option>
                  </select>
                  {errors.tipo_identificacion && <p style={{ color: 'red' }}>{errors.tipo_identificacion[0]}</p>}
                </div>
         
                                <h6
                                    className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Nombre del usuario*
                                </h6>
                                <div className="relative h-11 w-full min-w-[200px]">
                                    <input placeholder="Usuario" name="Nombre" type="text"
                                        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"/>
                                    <label
                                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                                    {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre[0]}</p>}
                                
                                </div>
                                
                                <h6
                                    className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Apellido*
                                </h6>
                                <div className="relative h-11 w-full min-w-[200px]">
                                    <input placeholder="Usuario" name="Apellido" type="text"
                                        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"/>
                                    <label
                                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                                    {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido[0]}</p>}
                                </div>
                             
                                <h6
                                    className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Correo*
                                </h6>
                                <div className="relative h-11 w-full min-w-[200px]">
                                    <input placeholder="usuario@batri.com" name="Correo" type="text"
                                        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"/>
                                    <label
                                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                                    {errors.correo && <p style={{ color: 'red' }}>{errors.correo[0]}</p>}
                                </div>
                                
                                
                                <h6
                                    className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Clave*
                                </h6>
                                
                                <div className="relative h-11 w-full min-w-[200px]">
                                    <input placeholder="**************" name="Clave" type={passwordVisible ? "text" : "password"}
                                        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"/>
                                    <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-sm font-medium text-blue-gray-700"
                                        onClick={passwordVisibility}
                                    >
                                        {passwordVisible ? "Ocultar" : "Mostrar"}
                                    </button>
                                    {errors.clave && <p style={{ color: 'red' }}>{errors.clave[0]}</p>}
                                </div>
                                
                            </div>

                            <div className="flex flex-col gap-6 mb-1 w-1/2 p-2">
                                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Cedula*
                                </h6>
                                <div className="relative h-11 w-full min-w-[200px] mb-4">
                                    <input placeholder="00000" name="Cedula" type="number"
                                        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"/>
                                    <label
                                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                                    {errors.cedula && <p style={{ color: 'red' }}>{errors.cedula[0]}</p>}
                                </div>
                
                                
                                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Telefono*
                                </h6>
                                <div className="relative h-11 w-full min-w-[200px] mb-2">
                                    <input placeholder="3..." name="Telefono" type="number"
                                        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"/>
                                    <label
                                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
                                    {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono[0]}</p>}
                                </div>

                                <h6
                                    className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                    Tipo Usuario*
                                </h6>
                                <Select
                                    name="nombre_rol"
                                    options={rolesOptions}
                                    className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900"
                                /> 

                            </div>
                            
                            <div className="inline-flex items-center"></div>
                        </div>
                        <button
                            className="mt-6 block w-full select-none rounded-lg bg-green-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="submit"
                            name="add"
                        >
                            Guardar Usuario
                        </button>
                    </form>
                </DialogBody>
            </Dialog>
        </>
    );
}
