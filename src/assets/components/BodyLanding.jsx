import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useMediaQuery } from 'react-responsive';

export function BodyLanding() {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="relative flex flex-col lg:flex-row items-center space-y-1 lg:space-y-0 lg:space-x-2" style={{ height: '500px' }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/fondo.png')" }}>
        <div className="absolute inset-0 backdrop-blur-md"></div>
      </div>
      {!isMobile && (
        <div className="relative z-10 lg:w-2/3 ml-5">
          <img
            className="h-96 w-full rounded-lg object-cover object-center shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
            src="/images/cargadores.png"
            alt="nature image"
          />
        </div>
      )}
      <div className={`relative z-10 ${isMobile ? 'w-full flex place-content-center' : 'lg:w-1/3 flex justify-center'}`}>
        <Card className="w-96 bg-[#90a4aec0]">
          <CardBody>
            <Typography variant="h3" color="blue-gray" className="mb-2 text-black">
              Bienvenido a Batri
            </Typography>
            <Typography className="mt-3 text-black">
              Podrás encontrar variedad de accesorios para tus celulares y diferentes periféricos.
            </Typography>
          </CardBody>
          <CardFooter className="flex justify-center">
            <a href="/catalogo">
              <Button className="px-4 py-2 text-black bg-[#5fdf2c] rounded-md">
                Visita nuestro catálogo
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
