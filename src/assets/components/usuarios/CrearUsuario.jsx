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
        <div>
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
            <form onSubmit={manejarEnvio}>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-6">
                    <div className="flex flex-col gap-6 mb-4 lg:w-1/2 p-2">
                        {/* Campo Tipo de Identificación */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Tipo de Identificación*
                            </h6>
                            <select
                                name="tipo_identificacion"
                                value={tipoIdentificacion}
                                onChange={(e) => setTipoIdentificacion(e.target.value)}
                                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                            >
                                <option value="CC">CC</option>
                                <option value="TI">TI</option>
                                <option value="CCE">CCE</option>
                            </select>
                            {errors.tipo_identificacion && <p className="text-red-500">{errors.tipo_identificacion[0]}</p>}
                        </div>

                        {/* Campo Nombre */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Nombre del usuario*
                            </h6>
                            <input
                                placeholder="Usuario"
                                name="Nombre"
                                type="text"
                                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                            />
                            {errors.nombre && <p className="text-red-500">{errors.nombre[0]}</p>}
                        </div>

                        {/* Campo Apellido */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Apellido*
                            </h6>
                            <input
                                placeholder="Apellido"
                                name="Apellido"
                                type="text"
                                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                            />
                            {errors.apellido && <p className="text-red-500">{errors.apellido[0]}</p>}
                        </div>

                        {/* Campo Correo */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Correo*
                            </h6>
                            <input
                                placeholder="usuario@batri.com"
                                name="Correo"
                                type="text"
                                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                            />
                            {errors.correo && <p className="text-red-500">{errors.correo[0]}</p>}
                        </div>

                        {/* Campo Clave */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Clave*
                            </h6>
                            <div className="relative">
                                <input
                                    placeholder="**************"
                                    name="Clave"
                                    type={passwordVisible ? "text" : "password"}
                                    className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2 text-sm font-medium text-blue-gray-700"
                                    onClick={passwordVisibility}
                                >
                                    {passwordVisible ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            {errors.clave && <p className="text-red-500">{errors.clave[0]}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 mb-4 lg:w-1/2 p-2">
                        {/* Campo Cédula */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Cedula*
                            </h6>
                            <input
                                placeholder="00000"
                                name="Cedula"
                                type="number"
                                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                            />
                            {errors.cedula && <p className="text-red-500">{errors.cedula[0]}</p>}
                        </div>

                        {/* Campo Teléfono */}
                        <div>
                            <h6 className="block font-sans text-base font-semibold text-blue-gray-900 mb-1">
                                Telefono*
                            </h6>
                            <input
                                placeholder="3..."
                                name="Telefono"
                                type="number"
                                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 font-sans text-sm text-blue-gray-700 outline-none transition-all placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900"
                            />
                            {errors.telefono && <p className="text-red-500">{errors.telefono[0]}</p>}
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
        </div>
    );
}
