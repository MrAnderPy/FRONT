import React, { useState } from "react";
import Swal from "sweetalert2";
import { Select, Option } from "@material-tailwind/react";
import { AuthContext } from "../../../AuthContext";
import { useContext } from "react";
import { Recuperar } from "./Recuperar";
const apiUrl = import.meta.env.VITE_API_URL;
const IniciarSesion = () => {
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [tipo, setTipo] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
      correo,
      clave,
      tipo,
    };

    try {
      const response = await fetch(`${apiUrl}/iniciar_sesion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData)
      if (responseData.estado) {
        Swal.fire({
          title: 'Inicio!',
          icon: 'success',
          footer: '<a href="/dashboard" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">Ir a Inicio</a>',
          showConfirmButton: false
        });

        const receivedToken = responseData.token;
        const accessData = responseData.acceso;
        const idCliente = responseData.id_cliente;
        const tipo = responseData.tipo; // Obtener tipo de la respuesta
        const tipoCliente = responseData.tipo_cliente; // Obtener tipo de la respuesta

        console.log(tipoCliente)

        login(receivedToken, accessData, idCliente, tipo, tipoCliente);



      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.msg,
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div className="max-md:text-center">
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-55px">
              Bienvenido de nuevo
            </h2>
            <img src='/images/imgLogin.avif' className='h-full rounded-lg' alt="Imagen de Login" />
          </div>
          <form onSubmit={handleLogin} className="space-y-6 max-w-md md:ml-auto max-md:mx-auto w-full">
            <h3 className="text-3xl font-extrabold mb-8 max-md:text-center">
              Iniciar Sesión
            </h3>
            <div>
              <input
                name="correo"
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="bg-gray-100 w-full text-sm px-4 py-3.5 rounded-md outline-blue-600"
                placeholder="pepe@gmail.com"
              />
            </div>
            <div>
              <input
                name="clave"
                type="password"
                autoComplete="current-password"
                required
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="bg-gray-100 w-full text-sm px-4 py-3.5 rounded-md outline-blue-600"
                placeholder="*******"
              />
            </div>
            <Select
              color="black"
              label="Tipo de usuario"
              value={tipo}
              onChange={(e) => setTipo(e)}
            >
              <Option value="1">Interno</Option>
              <Option value="2">Cliente</Option>
            </Select>

            <div className="flex items-center justify-between">
              <div className="text-sm mb-4 p-2 hover:bg-blue-gray-50 transition duration-300">
                <Recuperar/>
              </div>
            </div>
            <div className="!mt-10 mb-4">
              <button
                type="submit"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Login
              </button>
            </div>
            <a href="/registro">
            <p className="px-4 py-3 rounded-md w-full sm:w-auto text-blue-500 text-center">Registro</p>
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
export default IniciarSesion;