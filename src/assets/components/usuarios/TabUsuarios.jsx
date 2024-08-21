import {
  MagnifyingGlassIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import React, {useState, Suspense, useEffect } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useContext } from "react";
import { CrearUsuarioModal } from "./CrearUsuario";
import { EditarUsuarioModal } from "./EditarUsuario";
import { generarExcel } from "../servicios/reportesUsuario";
import  fetchData2  from "../servicios/fetchData2";
import { useMediaQuery } from 'react-responsive'
import { editar } from "../servicios/editar";// agregado 30/05/2024/ updateCategory y add  no se  cambian?
import { anular } from "../servicios/anular";
import { AuthContext } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 5;

const TABLE_HEAD = ["Id", "Nombre", "Apellido", "Cedula", "Correo","Tipo identificacion", "Rol", "Estado", "",];

export function TabUsuarios() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const handleClick = async (id_usuario, estado, token) => {
    console.log(id_usuario, estado);
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#6BF230',
        cancelButtonColor: '#FF2D20',
        confirmButtonText: '¡Sí, cambiar estado!'
    });

    if (result.isConfirmed) {
        // Aquí es donde haces la solicitud PUT
        try {
            const respuesta = await anular(`${apiUrl}/desactivar_usuario/`, id_usuario, estado);
            console.log(respuesta.data);

            if (respuesta.estado) {
                Swal.fire(
                    'Estado cambiado!',
                    respuesta.msg,
                    'success'
                );
                console.log(respuesta.data);

                // Actualizar la data con la nueva información del backend
                setData(prevData => 
                    prevData.map(user => 
                        user.id_usuario === id_usuario 
                        ? { ...user, estado: respuesta.data?.estado ?? user.estado } 
                        : user
                    )
                );
            } else {
                Swal.fire(
                    'Error!',
                    respuesta.msg,
                    'error'
                );
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire(
                'Error!',
                'Hubo un problema al cambiar el estado.',
                'error'
            );
        }
    }
  };
  
  useEffect(() => {
    // Función para cargar los datos de los usuarios
    const fetchData = async () => {
      try {
        const initialData = await fetchData2(
          `${apiUrl}/consultar_usuarios`,
          token
        );
        setData(initialData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (!token) {
      navigate("/"); // Redirigir al inicio si no hay token
    } else {
      fetchData();
    }
  }, [token, navigate]);

  const handleAddUser = (newUser) => {
    setData(prevData => [...prevData, newUser]);
  };


  const handleUpdateUser = async (id, updatedUser, token) => {
    try {
      const respuesta = await editar(`${apiUrl}/actualizar_usuario/`, updatedUser, id, token);
      if (respuesta && respuesta.estado) {
        setData(prevData => prevData.map(user => (user.id_usuario === id ? { ...user, ...updatedUser } : user)));
        Swal.fire('Actualizado!', respuesta.msg, 'success');
      } else {
        console.error('Error al actualizar el usuario:', respuesta ? respuesta.msg : 'Sin respuesta');
        Swal.fire('Error!', respuesta ? respuesta.msg : 'Sin respuesta', 'error');
      }
    } catch (error) {
      console.error('Hubo un error:', error);
      Swal.fire('Error!', 'Hubo un error al actualizar el usuario', 'error');
    }
  };

  const generarReporteExcel = () => {
    generarExcel(filteredData);
  };

  const filteredData = data.filter(data => {
    const matchesSearchTerm = Object.values(data).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || data.estado.toString() === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

 


  const totalFilteredPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilteredPageData = filteredData.slice(startIndex, endIndex);

  // Aquí va el resto de tu código, usando `currentFilteredPageData` en lugar de `currentPageData`
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' })
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
    <Card className="h-full w-full mb-2 z-0 bg-transparent p-2 ">
      <CardHeader floated={false} shadow={false} className="rounded-none py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <CrearUsuarioModal onAddUser={handleAddUser}/> 
            <Button className="flex items-center h-10 px-4 py-2" color="green" onClick={generarReporteExcel}>
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span className="px-1">Excel</span>
            </Button>
        </div>
        <div className="flex items-center space-x-2">
        <div className="relative">
            <MagnifyingGlassIcon className="absolute top-2 right-2 h-5 w-5 text-gray-400" />
            <Input
              className="pl-0 h-10 pr-8"
              label="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select
              className="h-10 px-4 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Activos e Inactivos</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>
          </div>
      </div>
        {isMobile ? (
          // Renderiza la versión móvil de la tabla (como tarjetas) Tambien lo de  los typography agregado 30/05/2024
          
            <div className="flex flex-wrap -mx-2">
            {currentFilteredPageData.map(({id_usuario, nombre, apellido, cedula, correo, nombre_rol,tipo_identificacion, estado }) => (
                <div key={id_usuario} className="card w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                  <Card className="mt-6 w-full">
                  <CardBody>

                  <Typography variant="h5" color="blue-gray" className="mb-2">
                     {nombre}
                  </Typography>
                  <Typography>
                    <p>{apellido}</p>
                    <p>{cedula}</p>
                    <p>{correo}</p>
                    <p>{nombre_rol}</p>
                    <p>{tipo_identificacion}</p>

                    <div className="w-max">
                    <Chip
                                id_usuario={id_usuario}
                                token={token}
                                estado={estado}
                                onClick={() => handleClick(id_usuario, estado, token)}
                                variant="ghost"
                                size="sm"
                                value={estado == '1' ? "Activo" : "Inactivo"} // Comparando con el valor como cadena
                                color={estado == '1' ? "green" : "blue-gray"} // Asignando colores según el estado
                              />
                    </div>
                  </Typography>
                  </CardBody>
                  <CardFooter className="pt-0">
                  <EditarUsuarioModal
                      key={id_usuario}
                      id_usuario={id_usuario}
                        onUpdateUser={handleUpdateUser}
                      />
                  </CardFooter>
                  </Card>                 
                </div>
              ))}
          </div>
        ) : (
          <>
            <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="min-w-8 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="min-w-max flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Suspense fallback={<div>Cargando</div>}>
                {currentFilteredPageData.map(({ id_usuario,  nombre, apellido,  cedula, correo,  nombre_rol,tipo_identificacion, estado }, index) => {
                    const isLast = index === data.length - 1;
                    const classes = isLast ? "p-4 " : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={id_usuario} className="h-8">
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {id_usuario}
                          </Typography>
                        </td>
                        <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs" 
                            >
                              {nombre}
                            </Typography>
                          </td>
                        <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs" 
                            >
                              {apellido}
                            </Typography>
                        </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs" 
                            >
                              {cedula}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs" 
                            >
                              {correo}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs" 
                            >
                              {tipo_identificacion}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xs" 
                            >
                              {nombre_rol}
                            </Typography>
                          </td>

                          <td className={classes}>
                            <div className="w-max">
                              <Chip
                                id_usuario={id_usuario}
                                token={token}

                                estado={estado}
                                onClick={() => handleClick(id_usuario, estado, token)}
                                variant="ghost"
                                size="sm"
                                value={estado == '1' ? "Activo" : "Inactivo"} // Comparando con el valor como cadena
                                color={estado == '1' ? "green" : "blue-gray"} // Asignando colores según el estado
                              />
                            </div>
                          </td>
                        <td className="p-2">
                          <div className="flex">
                            <EditarUsuarioModal
                            key={id_usuario}
                            id_usuario={id_usuario}
                            onUpdateUser={handleUpdateUser} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </Suspense>
            </tbody>
          </table>
          </>
        )}
    </CardHeader>
    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
      <Typography variant="small" color="blue-gray" className="font-normal">
        Página {currentPage} de {totalFilteredPages}
      </Typography>
      <div className="flex gap-2">
        <Button
          variant="outlined"
          size="sm"
          onClick={handlePreviousPage}
        >
          Anterior
        </Button>
        <Button
          variant="outlined"
          size="sm"
          onClick={handleNextPage}
        >
          Próxima
        </Button>
      </div>
    </CardFooter>
  </Card>
  );
}
