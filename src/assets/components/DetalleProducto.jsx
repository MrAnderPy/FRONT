import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

import { EyeIcon } from "@heroicons/react/24/solid";
const apiUrl = import.meta.env.VITE_API_URL;
export function DetalleProducto({ id_producto, onClose }) {
  const [size, setSize] = useState("xs");
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`${apiUrl}/consultar_producto/${id_producto}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducto(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchProducto();
  }, [id_producto]);

  return (
    <Dialog
      open={true}
      size={size || "md"}
      handler={onClose}
    >
      <DialogHeader>Detalle del Producto</DialogHeader>
      <DialogBody className="">
        {producto ? (
          <>
            <img 
              src={`${apiUrl}/${producto.foto}`} 
              alt={producto.nombre_producto} 
              className="mb-4 w-full h-64 object-cover rounded-xl"
            />
            <p>ID: {producto.id_producto}</p>
            <p>Nombre: {producto.nombre_producto}</p>
            <div className="max-w-3">
              <p>Descripción: {producto.descripcion}</p>
            </div>
            <p>Valor: ${producto.valor_compra}</p>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onClose}
          className="mr-1"
        >
          Cerrar
        </Button>
        
      </DialogFooter>
    </Dialog>
  );
}
