import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { AuthContext } from "../../../AuthContext";
import { PencilSquareIcon, EyeIcon } from "@heroicons/react/24/solid";
import fetchData2 from "../servicios/fetchData2";
const apiUrl = import.meta.env.VITE_API_URL;
export function DetallePedidoModal({ id_gestion }) {
  const [size, setSize] = useState(null);
  const [data, setData] = useState([]);
  const { token } = useContext(AuthContext);
  
  const handleOpen = (value) => setSize(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchData2(`${apiUrl}/consultar_detalle_pedido/${id_gestion}`, token);
        setData(data);
        console.log(data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchData();
  }, [token, id_gestion]);

  return (
    <>
      <div className="flex mx-2">
        <Button color="blue" onClick={() => handleOpen("md")} variant="gradient" className="flex">
          <EyeIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
      <Dialog
        open={size === "md"}
        size={size || "md"}
        handler={handleOpen}
      >
        <DialogHeader>Ver pedido</DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <div className="relative flex flex-col ml-4 text-gray-700 bg-white rounded-xl">
            <table className="w-full text-left min-w-full mb-12">
              <thead>
                <tr className="w-full h-full">
                <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      ID
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
                      Cantidad
                    </p>
                  </th>
                  
                  <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                    <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                      Subtotal
                    </p>
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {data.map(({ id_producto, nombre_producto, precio_unitario, cantidad, }) => (
                  <tr key={id_producto}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {cantidad}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {nombre_producto}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {precio_unitario}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        {cantidad}
                      </p>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                        ${precio_unitario * cantidad}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="">
            <Button
              variant="gradient"
              color="red"
              onClick={() => handleOpen(null)}
            >
              <span>cerrar</span>
            </Button>
          </div>
        </DialogBody>
        <DialogFooter></DialogFooter>
      </Dialog>
    </>
  );
}
