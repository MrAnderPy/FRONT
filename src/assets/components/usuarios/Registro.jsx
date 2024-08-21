import React, { useState } from 'react';
import { RegistroSchema } from './RegistroSchema';
import Swal from 'sweetalert2';
const apiUrl = import.meta.env.VITE_API_URL;
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

export function Registro() {
  const [errors, setErrors] = useState({});
  const [tipoUsuario, setTipoUsuario] = useState('natural');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tipoIdentificacion, setTipoIdentificacion] = useState('CC');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  const manejarEnvio = async (event) => {
    event.preventDefault();

    const datos = {
      nombre_cliente: event.target.elements.nombre_cliente.value,
      contacto: event.target.elements.contacto?.value,
      id: event.target.elements.id.value,
      correo: event.target.elements.correo.value,
      telefono: event.target.elements.telefono.value,
      clave: clave,
      confirmar_clave: confirmarClave,
      tipo_identificacion: event.target.elements.tipo_identificacion.value,
      tipo_usuario: event.target.elements.tipo_usuario.value,
      estado: '1',
    };

    const result = RegistroSchema.safeParse(datos);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
      console.log(fieldErrors);
    } else {
      if (clave !== confirmarClave) {
        setErrors({ confirmar_clave: 'Las contraseñas no coinciden' });
        return;
      }
      setErrors({});
      try {
        const respuesta = await enviarDatos(`${apiUrl}/registro`, datos);
        if (respuesta.estado) {
          Swal.fire({
            title: 'Agregado!',
            text: respuesta.msg,
            icon: 'success',
            footer: '<a href="/" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">Ir a Inicio</a>',
            showConfirmButton: false
          });
        } else {
          Swal.fire('Error!', respuesta.msg, 'error');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const passwordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
    <div className="font-[sans-serif] text-[#333]">
      <div className="text-center bg-gradient-to-r from-green-800 to-green-400 min-h-[160px] sm:p-6 p-4">
        <h4 className="sm:text-3xl text-2xl font-bold text-white">Crea una cuenta en Batri 😊</h4>
      </div>
      <div className="mx-4 mb-4 -mt-16">
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
              <label className="text-sm mb-2 block">Nombre*</label>
              <input name="nombre_cliente" type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Ingresa tu nombre" />
              {errors.nombre_cliente && <p className="text-red-500 text-xs mt-1">{errors.nombre_cliente}</p>}
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
              <div className="relative">
                <input
                  name="clave"
                  type={passwordVisible ? "text" : "password"}
                  className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500 pr-10"
                  placeholder="Ingresa tu contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-blue-gray-700"
                  onClick={passwordVisibility}
                >
                  {passwordVisible ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.clave && <p className="text-red-500 text-xs mt-1">{errors.clave}</p>}
            </div>
            <div>
              <label className="text-sm mb-2 block">Confirmar Contraseña*</label>
              <div className="relative">
                <input
                  name="confirmar_clave"
                  type={passwordVisible ? "text" : "password"}
                  className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md outline-blue-500 pr-10"
                  placeholder="Confirma tu contraseña"
                  value={confirmarClave}
                  onChange={(e) => setConfirmarClave(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-blue-gray-700"
                  onClick={passwordVisibility}
                >
                  {passwordVisible ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errors.confirmar_clave && <p className="text-red-500 text-xs mt-1">{errors.confirmar_clave}</p>}
            </div>
          </div>
        <div className="mt-6 text-center">
         

            <button type="submit" className="bg-blue-500 text-white px-4 py-3 rounded-md w-full sm:w-auto">
              Registrarse
            </button>
            <a href="/inicio">
              <p  className="text-blue-500  px-4 py-3 rounded-md w-full sm:w-auto">
                <span>Login</span>
              </p>
          </a>
          
          </div>
        </form>
      </div>
    </div>
  );
}
