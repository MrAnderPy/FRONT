import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import { useContext } from "react";
import { productoSchema } from "./ProductosValidaciones";
import { enviarDatos } from "../servicios/crear";
import { AuthContext } from "../../../AuthContext";
const apiUrl = import.meta.env.VITE_API_URL;
export function CrearProducto({ onAddCategory }) {
  const { token } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const imageRef = useRef();

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${apiUrl}/consultar_categorias`, {
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
      const categoriasActivas = data.filter(categoria => categoria.estado === 1);
      setCategorias(categoriasActivas);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);
 
  const manejarEnvio = async (event) => {
    event.preventDefault();
  
    const datos = {
      nombre_producto: event.target.elements.nombre_producto.value,
      id_categoria: event.target.elements.id_categoria.value,
      descripcion: event.target.elements.descripcion.value,
      porcentaje_unitario: event.target.elements.porcentaje_unitario.value,
      porcentaje_mayorista: event.target.elements.porcentaje_mayorista.value,
    };  
  
    const formData = new FormData();
    formData.append("nombre_producto", datos.nombre_producto);
    formData.append("id_categoria", datos.id_categoria);
    formData.append("descripcion", datos.descripcion);
    formData.append("porcentaje_unitario", datos.porcentaje_unitario);
    formData.append("porcentaje_mayorista", datos.porcentaje_mayorista);

  
    if (imageRef.current.files[0]) {
      formData.append('foto', imageRef.current.files[0]);
    } else {
      console.log("No se seleccionó ninguna foto");
      setErrors({ foto: "Por favor selecciona una foto" });
      return;
    }
  
    const result = productoSchema.safeParse(datos);
  
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
    } else {
      setErrors({});
      try {
        const respuesta = await fetch(`${apiUrl}/crear_producto`, {
          method: "POST",
          body: formData
        });
        const data = await respuesta.json();
        if (data.estado) {
          Swal.fire('Agregado!', data.msg, 'success');
          onAddCategory(data.data);
          setOpen(false);
        } else {
          Swal.fire('Error!', data.msg, 'error');
          setOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickUpload = () => {
    imageRef.current.click();
  };
  
  return (
    <>
      <Button color="green" onClick={() => setOpen(true)} variant="gradient" className="flex">
        <UserPlusIcon strokeWidth={2} className="h-4 w-4" />
        <span className="px-2">Crear nuevo producto</span>
      </Button>
      <Dialog
        open={open}
        handler={() => setOpen(!open)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogBody>
          <div className="relative flex-col text-gray-700 bg-transparent shadow-none rounded-xl bg-clip-border grid justify-items-center">
            <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Registrar nuevo producto
            </h4>
            <form  className="max-w-screen-lg mt-8 mb-2 w-full"  onSubmit={(event) => manejarEnvio(event)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-1">
                <div>
                <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Nombre del producto*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Silicona de..." name="nombre_producto" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                  {errors.nombre_producto && <p style={{ color: 'red' }}>{errors.nombre_producto[0]}</p>}
                </div>
                </div>

                <div>
                <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                 Descripcion*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Silicona de..." name="descripcion" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                  {errors.descripcion && <p style={{ color: 'red' }}>{errors.descripcion[0]}</p>}
                </div>
                </div>

                
                <div>
                <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                 Porcentaje de ganancia al por mayor*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Silicona de..." name="porcentaje_mayorista" required 
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                  {errors.descripcion && <p style={{ color: 'red' }}>{errors.descripcion[0]}</p>}
                </div>
                </div>

                
                <div>
                <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                 Porcentaje de ganancia a unidad*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Silicona de..." name="porcentaje_unitario" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                  {errors.descripcion && <p style={{ color: 'red' }}>{errors.descripcion[0]}</p>}
                </div>
                </div>
              
            
               
                <div>
                <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Categoría*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <select name="id_categoria" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                    {categorias.map(categoria => (
                      <option key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.id_producto && <p style={{ color: 'red' }}>{errors.id_producto[0]}</p>}
                </div>
                </div>
                <div>
                <h6 className="block -mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Imagen producto*
                </h6>
                <input type="file" ref={imageRef} required style={{ display: 'none' }} />
                <button type="button" onClick={handleClickUpload} className="peer  w-full rounded-md border border-black-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50">
                  Subir Imagen
                </button>
                {errors.foto && <p style={{ color: 'red' }}>{errors.foto}</p>}
                </div>
              </div>
              <Button type="submit" className="mt-6" fullWidth>
                Registrar
              </Button>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
