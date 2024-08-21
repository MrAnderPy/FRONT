import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import Swal from 'sweetalert2';
const apiUrl = import.meta.env.VITE_API_URL;
export function Recuperar() {
  const [open, setOpen] = useState(false);
  const [correo, setCorreo] = useState("");
  const [tipo, setTipo] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); // Estado para controlar el botón

  const handleOpen = () => setOpen((cur) => !cur);

  const handleSubmit = async () => {
    console.log("Correo:", correo);
    console.log("Tipo:", tipo);
    const data = { correo: correo, tipo: tipo };

    setIsDisabled(true); // Deshabilitar el botón

    try {
      const response = await fetch(`${apiUrl}/recuperar_cuenta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);

      const respuesta = await response.json();
      console.log("Response data:", respuesta);

      if (respuesta.estado) {
        Swal.fire('Éxito!', respuesta.msg, 'success');
        setOpen(false); // Cerrar el modal aquí
      } else {
        Swal.fire('Error!', respuesta.msg, 'error');
      }

    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', 'Error al enviar la solicitud.', 'error');
    } finally {
      setIsDisabled(false); // Habilitar el botón en caso de error
    }
  };

  return (
    <>
      <a onClick={handleOpen} className="cursor-pointer text-black hover:p-2">Recuperar Contraseña</a>
      <Dialog
        size="s"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[28rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h3" color="blue-gray">
              Recuperar mi cuenta
            </Typography>
            <Typography
              className="mb-2 font-normal"
              variant="h5"
              color="gray"
            >
              Para recuperar tu cuenta necesitamos tu correo para enviar una clave provisional con la cual podrás iniciar sesión
            </Typography>
            <Typography className="-mb-2" variant="h4">
              Tu correo
            </Typography>
            <Input
              label="Email"
              size="lg"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <Select
              color="black"
              label="Tipo de usuario"
              value={tipo}
              onChange={(e) => setTipo(e)}
            >
              <Option value="1">Interno</Option>
              <Option value="2">Cliente</Option>
            </Select>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="h1"
              onClick={handleSubmit}
              fullWidth
              disabled={isDisabled} // Deshabilitar el botón
            >
              Mandar clave de recuperación
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
