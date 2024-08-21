import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z.string()
    .trim()
    .nonempty({ message: 'El nombre de la categoría es requerido' })
    .max(50, 'El nombre de la categoría no puede tener más de 50 caracteres'),
  descripcion: z.string()
    .trim()
    .nonempty({ message: 'La descripción de la categoría es requerida' }),
});

export const manejarValidaciones = (event, setOpen) => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  categoriaSchema.safeParseAsync(data)
    .then(parsedData => {
      if (parsedData.success) {
        console.log('Datos validados:', parsedData.data);
      } else {
        console.log('Errores de validación:', parsedData.error.formErrors.fieldErrors);
      }
    });
};
