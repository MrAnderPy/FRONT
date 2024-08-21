import { z } from 'zod';

const validImageTypes = ['image/png', 'image/jpeg', 'image/gif'];

export const productoSchema = z.object({
  nombre_producto: z.string()
    .trim()
    .nonempty({ message: 'El nombre del producto es requerido' })
    .max(50, 'El nombre del producto no puede tener más de 50 caracteres'),

  foto: z.instanceof(File)
    .refine(file => validImageTypes.includes(file.type), {
      message: 'Solo se permiten archivos PNG, JPG, JPEG y GIF'
    })
    .optional()
});

export const manejarValidaciones = (event, setOpen) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    nombre_producto: formData.get('nombre_producto'),
    foto: formData.get('foto')
  };

  productoSchema.safeParseAsync(data)
    .then(parsedData => {
      if (parsedData.success) {
        console.log('Datos validados:', parsedData.data);
      } else {
        console.log('Errores de validación:', parsedData.error.formErrors.fieldErrors);
      }
    });
};
