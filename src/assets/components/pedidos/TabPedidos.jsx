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

  import { finalizar } from "../servicios/finalizar";
  import { anular } from "../servicios/anular";

  import { generarExcel } from "../servicios/reportePedido";
  import React, { Suspense } from "react";
  import  fetchData2  from "../servicios/fetchData2";
  import { useMediaQuery } from 'react-responsive'
  import { useState, useEffect } from "react";
  import { editar } from "../servicios/editar";
import { AuthContext } from "../../../AuthContext";
import { DetallePedidoModal } from "./DetallePedidosModal";
const apiUrl = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 5;


const TABLE_HEAD = ["Id", "Cliente", "","Fecha pedido","","","Total","","Estado","","","" ];
export function TabPedidos() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      const initialData = await fetchData2(`${apiUrl}/consultar_pedidos`, token);
      setData(Array.isArray(initialData) ? initialData : []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      setData([]); // En caso de error, asegúrate de que `data` sea un array vacío
    }
  };
  

  const updateData = async () => {
    try {
      const response = await fetch(`${apiUrl}/consultar_pedidos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const newData = await response.json();
      setData(newData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error al actualizar los productos:', error);
    }
  };

  useEffect(() => {
  //  const intervalId = setInterval(updateData, 5000); 
    
  //return () => clearInterval(intervalId);
  }, [token]);

  const handleAddpedido = (newpedido) => {
    setData(prevData => [...prevData, newpedido]);
  };
  
  
  const generarReporteExcel = () => {
    generarExcel(filteredData);
  };

  const filteredData = data.filter(data =>{
    const matchesSearchTerm = Object.values(data).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || data.estado.toString() === filterStatus;
    return matchesSearchTerm && matchesStatus;
  });

  const handleClick = async (id_pedido, estado) => {
    console.log(id_pedido, estado); // Asegúrate de que los valores sean correctos
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
        const respuesta = await finalizar(`${apiUrl}/finalizar_pedido/`, id_pedido, estado);
        console.log(respuesta);
        if (respuesta.estado) {
          Swal.fire({
            title: 'Cambio de estado',
            icon: 'success',
            text: respuesta.msg,
            footer: '<a href="/pedidos" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">OK</a>',
            showConfirmButton: false
          });
          console.log(respuesta.data);
          setData(prevData => prevData.map(cat => cat.id_pedido === id_pedido ? { ...cat, estado: respuesta.data.estado } : cat));
        
        } else {
          Swal.fire('Error!', respuesta.msg, 'error');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleClick2 = async (id_pedido, estado) => {
    console.log(id_pedido); // Asegúrate de que los valores sean correctos
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
        const respuesta = await anular(`${apiUrl}/desactivar_pedido/`, id_pedido,estado);
        console.log(id_pedido)
        console.log(estado)
        console.log(respuesta);
        if (respuesta.estado) {
          Swal.fire({
            title: 'Cambio de estado',
            icon: 'success',
            text: respuesta.msg,
            footer: '<a href="/pedidos" class="swal2-confirm swal2-styled" style="display: inline-block; background-color: #3085d6; color: #fff; padding: 10px 20px; margin-top: 10px;">OK</a>',
            showConfirmButton: false
          });
          console.log(respuesta.data);
          setData(prevData => prevData.map(cat => cat.id_pedido === id_pedido ? { ...cat, estado: respuesta.data.estado } : cat));
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
  
  // Aquí va el resto de tu código, usando `currentFilteredPageData` en lugar de `currentPageData`
  
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
      <Card className="h-full w-5/6 flex xl:ml-42 md:ml-32 sm:ml-7 mt-12 mb-2 z-0 bg-transparent p-2">
        <CardHeader floated={false} shadow={false} className="rounded-none py-2">
        <div className="flex flex-wrap min-w-full">
  <div className="flex items-center space-x-2 mx-12">
  
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
        label="Buscar"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
    <select hidden
      className="h-10 px-4 py-2 border border-gray-300 rounded-md min-w-[150px]"
      value={filterStatus}
      onChange={e => setFilterStatus(e.target.value)}
    >
      <option value="all">Activos y anuladas</option>
      <option value="1">Activos</option>
      <option value="0">Anuladas</option>
    </select>
  </div>
</div>
        </CardHeader>
        {isMobile ? (
          // Render mobile version of the table (as cards)
          <div className="flex flex-wrap -mx-2">
            {currentFilteredPageData.map(({ id_pedido, id_proveedor, fecha_pedido, total, estado }) => (
              <div key={id_pedido} className="card w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                <Card className="mt-6 w-full">
                  <CardBody>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                      {id_proveedor}
                    </Typography>
                    <Typography>
                      <p>{id_pedido}</p>
                      <p>{fecha_pedido}</p>
                      <p>{total}</p>
                      <div className="w-max">
                        <Chip
                          id_pedido={id_pedido}
                          onClick={() => handleClick(id_pedido)}
                          variant="ghost"
                          size="sm"
                          value={estado == '1' ? "Activo" : "Inactivo"}
                          color={estado == '1' ? "green" : "blue-gray"}
                        />
                      </div>
                    </Typography>
                  </CardBody>
                  <CardFooter className="pt-0">
                  
                    <Button id_pedido={id_pedido} color="red" onClick={() => handleClick(id_pedido)} className="p-3 m-1">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>       
        ) : (
          // Render desktop version of the table
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
                {currentFilteredPageData.map(({id_gestion, nombre_cliente, fecha_gestion, total, estado }, index) => {
                    const isLast = index === data.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
    
                    return (
                      <tr key={id_gestion} className="h-8">
                        <td className={classes} >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {id_gestion}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {nombre_cliente}
                          </Typography>
                        </td>
                        <td className={classes} >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {fecha_gestion}
                          </Typography>
                        </td>
                        <td className={classes} >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                           
                          </Typography>
                        </td>
                        <td className={classes} >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                           
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            {total}
                          </Typography>
                        </td>
                       
                          <td className={classes} >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xs"
                          >
                            
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                          <Chip
                            id_gestion={id_gestion}
                            estado={estado}
                            onClick={() => estado == '1' && handleClick(id_gestion, estado)}
                            variant="ghost"
                            size="sm"
                            value={estado == '1' ? "Pendiente" : "Pago"}
                            color={estado == '1' ? "orange" : "green"}
                          />
                          </div>
                        </td>
                        <td className={classes}>
                                            <div className="flex">

                                                <DetallePedidoModal id_gestion = {id_gestion} />

                                            </div>
                                        </td>

                                        <td className={classes}>
                                            <div className="flex">
<Button color="red" onClick={() => handleClick2(id_gestion, estado)} >
                                                <TrashIcon id_gestion = {id_gestion} estado={estado} strokeWidth={2} className="h-4 w-4"> </TrashIcon>
                </Button>                              
                                            </div>
                                        </td>
                        
                        <td className="p-2">
                          <div className="flex">
                          
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
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Página {currentPage} de {totalFilteredPages}
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" onClick={handlePreviousPage}>
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