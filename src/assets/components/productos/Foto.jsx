import React, { useState, useRef } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/solid";
import swal from "sweetalert2";
const apiUrl = import.meta.env.VITE_API_URL;
export function Foto({ id_producto, foto }) {
  const [open, setOpen] = useState(false);
  const [newFoto, setNewFoto] = useState(null);
  const [currentFoto, setCurrentFoto] = useState(foto);
  const fileInputRef = useRef(null);

  const handleOpen = () => setOpen(!open);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

    if (file && validImageTypes.includes(file.type)) {
      setNewFoto(file);
    } else {
      swal.fire("Archivo no válido", "Por favor, selecciona una imagen en formato PNG, JPG, JPEG o GIF", "error");
      event.target.value = null; // Clear the invalid file input
    }
  };

  const handleUpdateFoto = async () => {
    if (newFoto) {
      const formData = new FormData();
      formData.append("foto", newFoto);

      try {
        const response = await fetch(`${apiUrl}/actualizar_foto/${id_producto}`, {
          method: "PUT",
          body: formData,
        });
        const data = await response.json();
        if (data.estado) {
          setCurrentFoto(data.data.foto);
          swal.fire("Foto actualizada con éxito", "", "success");
        } else {
          swal.fire("Error al actualizar la foto", data.msg || "", "error");
        }
      } catch (error) {
        console.error("Error actualizando la foto:", error);
        swal.fire("Error al actualizar la foto", "", "error");
      }
    }
    handleOpen(); // Close dialog after update
  };

  const handleClickUpload = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  return (
    <>
      <Button onClick={handleOpen} color="blue">
        <EyeIcon className="h-6 w-6 text-black-500" />
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>{id_producto}</DialogHeader>
        <DialogBody>
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 overflow-hidden">
              <img
                src={`${apiUrl}/${currentFoto}`}
                alt={`Producto ${id_producto}`}
                className="object-cover w-full h-full"
              />
            </div>
            <input
              type="file"
              accept="image/png', 'image/jpeg', 'image/gif"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button
              onClick={handleClickUpload}
              className="mt-4 peer w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            >
              Subir Imagen
            </button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            <span>Cancelar</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdateFoto}>
            <span>Actualizar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
