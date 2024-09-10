import React, { useContext, useEffect, useState } from "react";
import { Card, Typography, Chip, Button } from "@material-tailwind/react";
import { AuthContext } from "../../AuthContext";
import { Footer } from '../components/Footer.jsx';
import { NavPerfil } from '../components/NavPerfils.jsx';
import { DetallePedidoModal } from "../components/pedidos/DetallePedidosModal.jsx";
const apiUrl = import.meta.env.VITE_API_URL;
export default function Perfil() {
  const { token, idCliente, tipo } = useContext(AuthContext);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      if (!idCliente || tipo === undefined) {
        setError("ID del usuario o tipo no disponible.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/consultar_perfil/${idCliente}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tipo }),
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
          console.log(data);
        } else {
          setError(`Error al obtener datos del usuario: ${response.status}`);
        }
      } catch (error) {
        setError(`Error en la carga de datos del usuario: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosUsuario();
  }, [token, idCliente, tipo]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <NavPerfil />
      <div className="flex justify-between">
        <div className="flex flex-wrap justify-center ">
          {usuario ? (
            <div className="max-w-xs m-4">
              <div className="bg-white shadow-xl rounded-lg py-3">
                <div className="photo-wrapper p-2">
                  <img
                    className="w-32 h-32 rounded-full mx-auto"
                    src="/images/perfil.jpg"
                    alt="Perfil"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{usuario.nombre_cliente}</h3>
                  <div className="text-center text-gray-400 text-xs font-semibold">
                    <p>{usuario.tipo_cliente}</p>
                  </div>
                  <table className="text-sm my-3 w-full">
                    <tbody>
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Identificación</td>
                        <td className="px-2 py-2">{usuario.tipo_identificacion}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Teléfono</td>
                        <td className="px-2 py-2">{usuario.telefono}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Correo</td>
                        <td className="px-2 py-2">{usuario.correo}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-center my-3">
                    <a className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium" href="/">Volver</a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No se encontraron datos del usuario.</p>
          )}
        </div>
        <div className="w-full">
          <TabPedidos />
        </div>
      </div>
      <Footer />
    </>
  );
}

const TABLE_HEAD = ["Id", "Fecha pedido", "Total", "Detalle"];
const ITEMS_PER_PAGE = 5;

export function TabPedidos() {
  const { token, idCliente } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/pedidos_cliente_perfil/${idCliente}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
      }
    };

    fetchData();
  }, [idCliente, token]);

  const totalFilteredPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilteredPageData = data.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalFilteredPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="h-full w-full bg-transparent p-2">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Pedidos
        </Typography>
        <div className="flex">
          <Button color="green" className="mr-2" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Anterior
          </Button>
          <Button color="green" onClick={handleNextPage} disabled={currentPage === totalFilteredPages}>
            Siguiente
          </Button>
        </div>
      </div>
      <table className="min-w-max w-full table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th key={head} className="p-4 border-b border-blue-gray-100 bg-blue-gray-50/50">
                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentFilteredPageData.map(({ id_gestion, fecha_gestion, total}) => (
            <tr key={id_gestion} className="h-8">
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                  {id_gestion}
                </Typography>
              </td>
              
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                  {fecha_gestion}
                </Typography>
              </td>
              
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal text-xs">
                  {total}
                </Typography>
              </td>
              <td>
                <DetallePedidoModal id_gestion={id_gestion} fecha={fecha_gestion} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
