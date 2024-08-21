import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';
import { productoSchema } from "./ProductosValidaciones";
import { enviarDatos } from "../servicios/crear";
const apiUrl = import.meta.env.VITE_API_URL;
export function CrearProducto({ onAddCategory }) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]); // Nuevo estado para categorías activas
  const imageRef = useRef();

  // Obtener categorías activas cuando el componente se monta
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${apiUrl}/consultar_categorias`);
        const data = await response.json();
        const categoriasActivas = data.filter(categoria => categoria.estado === 1);
        setCategorias(categoriasActivas);
      } catch (error) {
        console.log("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const manejarEnvio = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(); // Crear el objeto FormData
  
    const datos = {
      nombre_producto: event.target.elements.nombre_producto.value,
      valor_producto: (event.target.elements.valor_producto.value),
      cantidad: (event.target.elements.cantidad.value, 10),
      id_categoria: event.target.elements.id_categoria.value,
      descripcion: event.target.elements.descripcion.value,
    };  
  
    // Agrega los datos al objeto FormData
    formData.append("nombre_producto", datos.nombre_producto);
    formData.append("valor_producto", datos.valor_producto);
    formData.append("cantidad", datos.cantidad);
    formData.append("id_categoria", datos.id_categoria); // Asegúrate de usar el nombre correcto aquí.
    formData.append("descripcion", datos.descripcion);
  
    // Agrega la foto al objeto FormData
    if (imageRef.current.files[0]) {
      formData.append('foto', imageRef.current.files[0]);
    } else {
      console.log("No se seleccionó ninguna foto");
      setErrors("Por favor selecciona una foto");
      return;
    }
  
    const result = productoSchema.safeParse(datos);
  
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors);
    } else {
      setErrors({}); // Clear errors if validation passes
      try {
        const respuesta = await enviarDatos(`${apiUrl}/crear_producto`, formData); // Enviar FormData
        if (respuesta.estado) {
          Swal.fire('Agregado!', respuesta.msg, 'success');
          onAddCategory(respuesta.data);
          setOpen(false);
        } else {
          Swal.fire('Error!', respuesta.msg, 'error');
          setOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
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
            <form className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96" onSubmit={(event) => manejarEnvio(event)}>
              <div className="flex flex-col gap-6 mb-1">
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Nombre del producto*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Silicona de..." name="nombre_producto" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                 
                  {errors.nombre_producto && <p style={{ color: 'red' }}>{errors.nombre_producto[0]}</p>}

                </div>
                
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                 Descripcion*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Silicona de..." name="descripcion" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                   
                   {errors.descripcion && <p style={{ color: 'red' }}>{errors.descripcion[0]}</p>}
                </div>

                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Precio*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="100000" name="valor_producto" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                  
                   {errors.valor_producto && <p style={{ color: 'red' }}>{errors.valor_producto[0]}</p>}
                </div>
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Cantidad*
                </h6>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input placeholder="Cantidad en stock" name="cantidad" required
                    className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                   
                   {errors.descripcion && <p style={{ color: 'red' }}>{errors.descripcion[0]}</p>}
                </div>
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Imagen producto*
                </h6>
                <input type="file" ref={imageRef} required />
                <h6 className="block -mb-3 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                  Categoria*
                </h6>
                <select name="id_categoria" required className="border border-gray-300 rounded px-5 py-2 text-sm focus:">
                  <option disabled selected>Seleccione una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {errors.id_categoria && <p style={{ color: 'red' }}>{errors.id_categoria[0]}</p>}
              </div>
              <Button type="submit" color="green" className="mt-6" fullWidth>
                Crear Producto
              </Button>
            </form>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
