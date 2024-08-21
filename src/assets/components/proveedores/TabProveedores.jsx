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
import { useContext } from "react";
import { CrearProveedorModal } from "../proveedores/CrearProveedorModal";
import { EditarProveedorModal } from "../proveedores/EditarProveedorModal";
import { anular } from "../servicios/anular";
import { generarExcel } from "../servicios/reportesProveedor";
import React, { Suspense } from "react";
import fetchData2  from "../servicios/fetchData2";
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from "react";
import { editar } from "../servicios/editar";
import { AuthContext } from "../../../AuthContext";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const ITEMS_PER_PAGE = 5;
const TABLE_HEAD = ["Id", "Nombre Empresa", "Telefono Contacto", "Nit", "Sello", "Direccion", "Tipo Proveedor", "Estado", ""];

export function TabProveedores() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate(); // Ajusta según tu entorno de navegación

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await fetchData2(`${apiUrl}/consultar_proveedores`, token);
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

  const handleAddProveedor = (newProveedor) => {
    setData(prevData => [...prevData, newProveedor]);
  };

  // Función para manejar la actualización de proveedores
  const handleUpdateProveedor = async (id, updatedProveedor) => {
    try {
      console.log('ID recibido:', id);
      console.log('Proveedor actualizado:', updatedProveedor);
  
      const respuesta = await editar(`${apiUrl}/actualizar_proveedor/`, updatedProveedor,id,token);
      console.log('Respuesta del servidor:', respuesta);
  
      if (respuesta && respuesta.estado) {
        setData(prevData =>
          prevData.map(prov => (prov.id_proveedor === id ? { ...prov, ...updatedProveedor } : prov))
        );
        Swal.fire('Actualizado!', respuesta.msg, 'success');
      } else {
        Swal.fire('Error!', respuesta ? respuesta.msg : 'No se recibió una respuesta válida del servidor', 'error');
      }
    } catch (error) {
      console.error('Hubo un error:', error);
      Swal.fire('Error!', 'Hubo un error al actualizar el proveedor', 'error');
    }
  };
  const generarReporteExcel = () => {
    generarExcel(filteredData);
  };
  
  
  
  // Función para manejar el cambio de estado de proveedores
  const handleClick = async (id_proveedor, estado) => {
    console.log(id_proveedor)
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
        console.log('ID recibido:', id_proveedor);
        console.log('Estado recibido:', estado);
        const respuesta = await anular(`${apiUrl}/desactivar_proveedor/`,id_proveedor, estado);
        if (respuesta.estado) {
          Swal.fire('Estado cambiado!', respuesta.msg, 'success');
          setData(prevData => prevData.map(prov => (prov.id_proveedor === id_proveedor ? { ...prov, estado: respuesta.data.estado } : prov)));
        } else {
          Swal.fire('Error!', respuesta.msg, 'error');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

 

  // Función para filtrar y paginar datos
  const filteredData = data.filter(prov => {
    const matchesSearchTerm = Object.values(prov).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || prov.estado.toString() === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  const totalFilteredPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFilteredPageData = filteredData.slice(startIndex, endIndex);
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
      <Card className="h-full w-full mb-2 z-0 bg-transparent p-2">
       <CardHeader floated={false} shadow={false} className="rounded-none py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <CrearProveedorModal onAddProveedor={handleAddProveedor}/> 
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
          // Renderiza la versión móvil de la tabla (como tarjetas)
        <div className="flex flex-wrap -mx-2">        
          {currentFilteredPageData.map(({ id_proveedor, nombre_empresa, telefono_contacto, cedula_nit, sello, cedula, direccion, tipo_proveedor, estado }) => (
            <div key={id_proveedor} className="card w-full sm:w-1/2">
              <Card className="mt-6 w-96">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                {nombre_empresa}
                </Typography>
                <Typography>
                <p>{telefono_contacto}</p>
                <p>{cedula_nit}</p>
                <p>{sello}</p>
                <p>{cedula}</p>
                <p>{direccion}</p>
                <p>{tipo_proveedor}</p>
                <div className="w-max">
                              <Chip
                                id_proveedor={id_proveedor}
                                estado={estado}
                                onClick={() => handleClick(id_proveedor)}
                                variant="ghost"
                                size="sm"
                                value={estado==  '1' ? "Activo" : "Inactivo"}
                                color={estado==  '1' ? "green" : "blue-gray"}
                              />
                            </div>
                </Typography>
              </CardBody>
              <CardFooter className="pt-0">
              <EditarProveedorModal
  key={id_proveedor} // Asegúrate de tener una key única si estás haciendo un listado
  id_proveedor={id_proveedor}
  onUpdateProveedor={handleUpdateProveedor} // Asegúrate de pasar la función correcta
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
                    className="min-w-8 cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors "
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
               {currentFilteredPageData.map(({ id_proveedor, nombre_empresa, telefono_contacto, cedula_nit, sello, direccion, tipo_proveedor, estado }, index) => {
                const isLast = index === data.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
  
                  
                    return (
                      <tr key={id_proveedor} className="h-8">
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {id_proveedor}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {nombre_empresa}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {telefono_contacto}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {cedula_nit}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {sello}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs" 
                          >
                            {direccion}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={tipo_proveedor=="Juridico" ? "Natural" : "Juridico"}
                              color={tipo_proveedor=="Juridico" ? "cyan" : "light-green"}
                            />
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <Chip
                              id_proveedor={id_proveedor}
                              estado={estado}
                              onClick={() => handleClick(id_proveedor, estado)}
                              variant="ghost"
                              size="sm"
                              value={estado == '1' ? "Activo" : "Inactivo"}
                              color={estado == '1' ? "green" : "blue-gray"}
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex">
                          <EditarProveedorModal
  key={id_proveedor} // Asegúrate de tener una key única si estás haciendo un listado
  id_proveedor={id_proveedor}
  onUpdateProveedor={handleUpdateProveedor} // Asegúrate de pasar la función correcta
/>

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
          <Button variant="outlined" size="sm" onClick={handlePreviousPage} >
            Anterior
          </Button>
          <Button variant="outlined" size="sm" onClick={handleNextPage}>
            Próxima
          </Button>
        </div>
      </CardFooter>


      </Card> 
    );
}