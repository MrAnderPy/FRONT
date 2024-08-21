import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Chip,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { useState } from 'react';
import { DetalleProducto } from './DetalleProducto';
import { EyeIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../../AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function Tarjeta({ id_producto, foto, nombre_producto, nombre_categoria, valor_compra, onAgregarAlCarrito }) {
  const { token } = useContext(AuthContext);
  const [showDetalle, setShowDetalle] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const navigate = useNavigate();

  const handleAgregarAlCarrito = () => {
    if (!token) {
      navigate('/inicio');
    } else {
      onAgregarAlCarrito();
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 10000); // Ocultar el popover después de 2 segundos
    }
  };

  return (
    <Card className="w-full sm:w-auto mb-6">
      <CardHeader color="blue-gray" className="relative h-56 overflow-hidden !mt-0">
        <img
          src={foto}
          alt={nombre_producto}
          className="w-full h-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <div className="flex justify-between">
          <div>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              {nombre_producto}
            </Typography>
          </div>
          <div>
            <Button onClick={() => setShowDetalle(true)} className="border-2 border-green-500">
              <EyeIcon strokeWidth={2} className="h-4 w-4 " />
            </Button>
          </div>
        </div>
        <Typography variant="h6" color="blue-gray" className="mb-2">
          <div className="flex gap-2">
            <Chip variant="ghost" value={nombre_categoria} />
          </div>
        </Typography>
        <Typography variant="h6" color="green" className="font-semibold text-lg">
          ${valor_compra}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Popover
          open={showPopover}
          handler={() => setShowPopover(!showPopover)}
          placement="top"
          animate={{ mount: { scale: 1 }, unmount: { scale: 0.9 } }}
        >
          <PopoverHandler onClick={handleAgregarAlCarrito}>
            <Button >Agregar al carrito</Button>
          </PopoverHandler>
          <PopoverContent>
            <Typography variant="small">
              Producto agregado al carrito.
            </Typography>
          </PopoverContent>
        </Popover>
      </CardFooter>
      {showDetalle && <DetalleProducto id_producto={id_producto} onClose={() => setShowDetalle(false)} />}
    </Card>
  );
}
