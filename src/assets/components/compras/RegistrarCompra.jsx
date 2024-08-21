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
import { compraSchema } from "./ComprasSchema";
const apiUrl = import.meta.env.VITE_API_URL;
export function RegistrarCompraModal({ onAddCategory }) {
  const [size, setSize] = useState(null);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const { token } = useContext(AuthContext);
  const [proveedores, setProveedores] = useState([]);
  const [idProveedor, setIdProveedor] = useState("");
  const [productos, setProductos] = useState([]);
  const [errors, setErrors] = useState({});
  const handleOpen = (value) => setSize(value);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProveedores();
    fetchProductos();
  }, [token]);

  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${apiUrl}/consultar_proveedores`, {
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
      const proveedoresActivas = data.filter(proveedor => proveedor.estado === 1);
      setProveedores(proveedoresActivas);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      const initialData = await fetchData2(`${apiUrl}/consultar_productos`, token);
      setData(initialData);
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
  };

  const validarDatos = () => {
    const resultados = productos.map((producto, index) => {
      const resultado = compraSchema.safeParse(producto);
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

  const guardarCompra = async (event) => {
    event.preventDefault();
  
    if (!validarDatos()) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la validación',
        text: 'Hay errores en los datos de los productos. Por favor, revisa y corrige los campos indicados.'
      });
      return;
    }
  
    const detalleCompras = productos.map(producto => ({
      cantidad: producto.cantidad,
      id_producto: producto.id_producto,
      precio_unitario: producto.precio
    }));
  
    const datosCompra = {
      id_proveedor: idProveedor, 
      detalle_compras: detalleCompras,
      total 
    };
  
    try {
      const respuesta = await fetch(`${apiUrl}/crear_compra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosCompra)
      });
    
      const data = await respuesta.json();
    
      if (data.estado) {
        Swal.fire('Agregado!', data.msg, 'success');
        onAddCategory(data.data);  // Usar los datos completos del backend
        handleOpen(null)

      } else {
        Swal.fire('Error!', data.msg, 'error');
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      handleOpen(null)
    }finally {
      handleOpen(null)
    }
  };

  return (
    <>
      <div className="flex mx-2">
        <Button color="green" onClick={() => handleOpen("lg")} variant="gradient" className="flex">
          <UserPlusIcon strokeWidth={2} className="h-4 w-4" />Agregar Compra
        </Button>
      </div>
      <Dialog open={size === "lg"} size={size || "lg"} handler={handleOpen}>
        <DialogHeader>Registrar compra</DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <div className="relative flex flex-col ml-4 text-gray-700 bg-white rounded-xl">
            <div className="mb-6">
              <select
                name="id_proveedor"
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
                required
                className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              >
                <option value="" disabled selected>Seleccionar proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                    {proveedor.nombre_empresa}
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
                    <td className="p-4 border-b border-blue-gray-50">
                      <input
                        type="number"
                        value={producto.cantidad}
                        onChange={(e) => actualizarProducto(index, 'cantidad', e.target.value)}
                        className="w-full p-2 border border-blue-gray-200 rounded"
                      />
                      {errors[index]?.cantidad && (
                        <p className="text-red-500 text-xs mt-1">{errors[index].cantidad}</p>
                      )}
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <select
                        value={producto.id_producto}
                        onChange={(e) => actualizarProducto(index, 'id_producto', e.target.value)}
                        className="w-full p-2 border border-blue-gray-200 rounded"
                      >
                        <option value="">Seleccionar producto</option>
                        {data.map(producto => (
                          <option key={producto.id_producto} value={producto.id_producto}>
                            {producto.descripcion}
                          </option>
                        ))}
                      </select>
                      {errors[index]?.id_producto && (
                        <p className="text-red-500 text-xs mt-1">{errors[index].id_producto}</p>
                      )}
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <input
                        type="number"
                        value={producto.precio}
                        onChange={(e) => actualizarProducto(index, 'precio', e.target.value)}
                        className="w-full p-2 border border-blue-gray-200 rounded"
                      />
                      {errors[index]?.precio && (
                        <p className="text-red-500 text-xs mt-1">{errors[index].precio}</p>
                      )}
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p>${producto.subtotal.toFixed(2)}</p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                    <Button color="red" onClick={() => eliminarProducto(index)} variant="gradient">
                      Eliminar
                    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 pr-8">
              <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
            </div>
            <Button color="green" onClick={agregarProducto} variant="gradient">
            Agregar Producto
          </Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpen(null)}
            className="mr-1"
          >
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={guardarCompra}>
            <span>Guardar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
