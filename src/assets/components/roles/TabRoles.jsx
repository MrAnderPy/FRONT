import {
  MagnifyingGlassIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { CrearRolModal } from "../roles/CrearRolModal";
import { EditarRolModal } from "../roles/EditarRolModal";
import { PermisosRolModal } from "../roles/PermisosModal";
import { anular } from "../servicios/anular";
import fetchData2 from "../servicios/fetchData2";
import { generarExcel } from "../servicios/reportesRol";
import React, { Suspense } from "react";
import { fetchData } from "../servicios/fetchData";
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from "react";
import { editar } from "../servicios/editar";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 5;

const TABLE_HEAD = ["Id", "Nombre", "Descripción", "Estado", "", ""];

export function TabRoles() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await fetchData2(`${apiUrl}/consultar_roles`, token);
        setData(initialData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/"); // Redirigir al inicio si no hay token
    } else {
      fetchData();
    }
  }, [token, navigate]);


  const handleUpdatePermisos = async (id, updatedPermisos) => {
    try {
      const respuesta = await editar(`${apiUrl}/actualizar_permisos_rol/`, updatedPermisos, id);
      if (respuesta && respuesta.estado) {
        setData(prevData => prevData.map(cat => (cat.id_permiso === id ? { ...cat, ...updatedPermisos } : cat)));
        Swal.fire('Actualizado!', respuesta.msg, 'success');
      } else {
        console.error('Error al actualizar el permiso:', respuesta ? respuesta.msg : 'Sin respuesta');
        Swal.fire('Error!', respuesta ? respuesta.msg : 'Sin respuesta', 'error');
      }
    } catch (error) {
      console.error('Hubo un error:', error);
      Swal.fire('Error!', 'Hubo un error al actualizar el permiso', 'error');
    }
  };

  const handleUpdateRol = async (id, updatedRol) => {
    try {
      const respuesta = await editar(`${apiUrl}/actualizar_rol/`, updatedRol, id);
      if (respuesta && respuesta.estado) {
        setData(prevData => prevData.map(cat => (cat.id_rol === id ? { ...cat, ...updatedRol } : cat)));
        Swal.fire('Actualizado!', respuesta.msg, 'success');
      } else {
        console.error('Error al actualizar el rol:',respuesta ? respuesta.msg : 'Sin respuesta');
        Swal.fire('Error!', respuesta ? respuesta.msg : 'Sin respuesta', 'error');
      }
    } catch (error) {
      console.error('Hubo un error:', error);
      Swal.fire('Error!', 'Hubo un error al actualizar el rol', 'error');
    }
  };
  const handleAddRol = (newRol) => {
    setData(prevData => [...prevData, newRol]);
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

  const handleClick = async (id_rol, estado) => {
    console.log(id_rol, estado);
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, cambiar estado!'
    });

    if (result.isConfirmed) {
      try {
        const respuesta = await anular(`${apiUrl}/desactivar_rol/`, id_rol, estado);
        console.log(respuesta);
        if (respuesta.estado) {
          Swal.fire('Estado cambiado!', respuesta.msg, 'success');
          console.log(respuesta.data);
          setData(prevData => prevData.map(cat => cat.id_rol === id_rol ? { ...cat, estado: respuesta.data.estado } : cat));
        } else {
          Swal.fire('Error!', respuesta.msg, 'error');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const totalFilteredPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilteredPageData = filteredData.slice(startIndex, endIndex);

  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });

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
    <Card className="h-full w-full mb-2 z-0 bg-transparent p-2">
      <CardHeader floated={false} shadow={false} className="rounded-none py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CrearRolModal onAddCategory={handleAddRol} />
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
          <div className="flex flex-wrap">
            {currentFilteredPageData.map(({ id_rol, nombre, descripcion, estado }) => (
              <div key={id_rol} className="card w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <Card className="mt-6 w-full">
                  <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                      {nombre}
                    </Typography>
                    <Typography>
                      <p>{descripcion}</p>
                      <div className="w-max">
                        <Chip
                          id_rol={id_rol}
                          estado={estado}
                          onClick={() => handleClick(id_rol, estado)}
                          variant="ghost"
                          size="sm"
                          value={estado == '1' ? "Activo" : "Inactivo"}
                          color={estado == '1' ? "green" : "blue-gray"}
                        />
                      </div>
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-0">
                    <EditarRolModal
                      key={id_rol}
                      id_rol={id_rol}
                      onUpdateCategory={handleUpdateRol}
                    />
                    <PermisosRolModal
                      id_rol={id_rol}
                      onUpdatePermisos={handleUpdatePermisos}
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
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Suspense fallback={<div>Cargando</div>}>
                {currentFilteredPageData.map(({ id_rol, nombre, descripcion, estado }, index) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id_rol} className="h-8">
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {id_rol}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {nombre}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {descripcion}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            id_rol={id_rol}
                            estado={estado}
                            onClick={() => handleClick(id_rol, estado)}
                            variant="ghost"
                            size="sm"
                            value={estado == '1' ? "Activo" : "Inactivo"}
                            color={estado == '1' ? "green" : "blue-gray"}
                          />
                        </div>
                      </td>
                      <td className={classes}>
                        <EditarRolModal
                          key={id_rol}
                          id_rol={id_rol}
                          onUpdateCategory={handleUpdateRol}
                        />
                      </td>
                      <td className={classes}>
                        <PermisosRolModal
                          id_rol={id_rol}
                          onUpdatePermisos={handleUpdatePermisos}
                        />
                      </td>
                    </tr>
                  );
                })}
              </Suspense>
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalFilteredPages }, (_, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    color={currentPage === index + 1 ? 'blue' : 'blue-gray'}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalFilteredPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
        </CardHeader>
    </Card>
  );
}
