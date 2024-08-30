import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { AuthContext } from "../../../AuthContext";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import fetchData2 from "../servicios/fetchData2";
import { ventaSchema } from "./VentaSchema";
const apiUrl = import.meta.env.VITE_API_URL;

export function RegistrarVentaModal({ onAddVenta }) {
  const [size, setSize] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [idCliente, setIdCliente] = useState("");
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);
  const [total, setTotal] = useState(0); // Estado para almacenar el total
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  const handleOpen = (value) => setSize(value);

  useEffect(() => {
    fetchClientes();
    fetchProductos();
  }, [token]);

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${apiUrl}/consultar_clientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const clientesActivos = data.filter(cliente => cliente.estado === 1);
      setClientes(clientesActivos);
    } catch (error) {
      console.log("Error fetching clients:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const initialData = await fetchData2(`${apiUrl}/consultar_productos`, token);
      setListaProductos(initialData);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  const agregarProducto = () => {
    setProductos([...productos, { cantidad: 0, id_producto: '', precio: 0, subtotal: 0 }]);
  };

  const actualizarProducto = (index, field, value) => {
    const nuevosProductos = [...productos];
    if (field === 'cantidad' || field === 'precio') {
      value = parseFloat(value);
      if (isNaN(value)) value = 0;
    }
    nuevosProductos[index][field] = value;

    if (field === 'cantidad' || field === 'precio') {
      nuevosProductos[index].subtotal = nuevosProductos[index].cantidad * nuevosProductos[index].precio;
    }

    setProductos(nuevosProductos);

    // Calcular el nuevo total
    const nuevoTotal = nuevosProductos.reduce((sum, producto) => sum + producto.subtotal, 0);
    setTotal(nuevoTotal);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);

    // Recalcular el total después de eliminar un producto
    const nuevoTotal = nuevosProductos.reduce((sum, producto) => sum + producto.subtotal, 0);
    setTotal(nuevoTotal);
  };

  const validarDatos = () => {
    const resultados = productos.map((producto, index) => {
      const resultado = ventaSchema.safeParse(producto);
      return { resultado, index };
    });
    const errores = resultados.filter(({ resultado }) => !resultado.success);

    if (errores.length > 0) {
      const fieldErrors = errores.reduce((acc, { resultado, index }) => {
        resultado.error.issues.forEach(issue => {
          acc[index] = acc[index] || {};
          acc[index][issue.path[0]] = issue.message;
        });
        return acc;
      }, {});
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const guardarVenta = async (event) => {
    event.preventDefault();

    if (!validarDatos()) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la validación',
        text: 'Hay errores en los datos de los productos. Por favor, revisa y corrige los campos indicados.'
      });
      return;
    }

    const detalleVentas = productos.map(producto => ({
      cantidad: producto.cantidad,
      id_producto: producto.id_producto,
      precio_unitario: producto.precio
    }));

    const datosVenta = {
      id_cliente: idCliente,
      detalle_ventas: detalleVentas,
      total // Incluye el total en los datos de la venta
    };

    try {
      const respuesta = await fetch(`${apiUrl}/crear_venta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosVenta)
      });
      const data = await respuesta.json();

      if (data.estado) {
        Swal.fire('Agregado!', data.msg, 'success');
        onAddVenta(data.data);  // Usar los datos completos del backend
        handleOpen(null)
      } else {
        Swal.fire('Error!', data.msg, 'error');
        handleOpen(null)
      }
    } catch (error) {
      console.log(error);
      handleOpen(null)
    }
  };

  return (
    <>
      <div className="flex justify-end mx-2 mb-4"> {/* Posición ajustada */}
        <Button color="green" onClick={() => handleOpen("lg")} variant="gradient" className="flex">
          <UserPlusIcon strokeWidth={2} className="h-4 w-4" />Agregar venta
        </Button>
      </div>
      <Dialog
        open={size === "lg"}
        size={size || "lg"}
        handler={handleOpen}
      >
        <DialogHeader>Registrar venta</DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <div className="relative flex flex-col ml-4 text-gray-700 bg-white rounded-xl">
            <div className="mb-6">
              <select
                name="id_cliente"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                required
                className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.contacto}
                  </option>
                ))}
              </select>
            </div>
            <table className="w-full text-left min-w-full mb-12">
              <thead>
                <tr className="w-full h-full">
                  <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Cantidad
                    </p>
                  </th>
                  <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Producto
                    </p>
                  </th>
                  <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Precio
                    </p>
                  </th>
                  <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Subtotal
                    </p>
                  </th>
                  <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Acciones
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td className="p-4">
                      <input
                        type="number"
                        name={`cantidad-${index}`}
                        value={producto.cantidad}
                        onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)}
                        className="block w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 text-sm text-blue-gray-900 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900 disabled:border-0 disabled:bg-blue-gray-50"
                      />
                      {errors[index]?.cantidad && (
                        <span className="text-red-500 text-sm">{errors[index].cantidad}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        name={`id_producto-${index}`}
                        value={producto.id_producto}
                        onChange={(e) => actualizarProducto(index, 'id_producto', e.target.value)}
                        className="block w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 text-sm text-blue-gray-900 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900 disabled:border-0 disabled:bg-blue-gray-50"
                      >
                        <option value="">Seleccionar producto</option>
                        {listaProductos.map(prod => (
                          <option key={prod.id_producto} value={prod.id_producto}>
                            {prod.nombre_producto}
                          </option>
                        ))}
                      </select>
                      {errors[index]?.id_producto && (
                        <span className="text-red-500 text-sm">{errors[index].id_producto}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        name={`precio-${index}`}
                        value={producto.precio}
                        onChange={(e) => actualizarProducto(index, 'precio', e.target.value)}
                        className="block w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 text-sm text-blue-gray-900 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900 disabled:border-0 disabled:bg-blue-gray-50"
                      />
                      {errors[index]?.precio && (
                        <span className="text-red-500 text-sm">{errors[index].precio}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        name={`subtotal-${index}`}
                        value={producto.subtotal}
                        readOnly
                        className="block w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-2 text-sm text-blue-gray-900 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 focus:border-2 focus:border-gray-900 disabled:border-0 disabled:bg-blue-gray-50"
                      />
                    </td>
                    <td className="p-4">
                      <Button color="red" onClick={() => eliminarProducto(index)}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>
              <Button color="green" onClick={agregarProducto}>Agregar Producto</Button>
            </div>
            <div className="flex justify-end mb-10">
            <Button color="green" className="mr-2" onClick={guardarVenta}>Guardar</Button>
            <Button color="red" onClick={() => handleOpen(null)}>Cancelar</Button>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
         
        </DialogFooter>
      </Dialog>
    </>
  );
}
