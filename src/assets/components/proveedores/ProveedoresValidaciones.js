// validaciones.js
import { z } from 'zod';
export const proveedorSchema = z.object({
    nombre_empresa: z.string()
    .trim()
    .nonempty({ message: 'El nombre de la empresa es requerido' })
    .max(100, { message: 'El nombre de la empresa no puede tener más de 100 caracteres' }),
    telefono_contacto: z.string()
      .trim()
      .nonempty({ message: 'El teléfono de contacto es requerido' })
      .regex(/^\+?\d{7,15}$/, { message: 'El teléfono de contacto debe ser un número válido' }),
    nit: z.string()
      .trim()
      .nonempty({ message: 'El NIT es requerido' })
      .max(20, { message: 'El NIT no puede tener más de 20 caracteres' }),
    sello: z.string()
      .trim()
      .nonempty({ message: 'El sello es requerido' })
      .max(100, { message: 'El sello no puede tener más de 100 caracteres' }),
    cedula: z.string()
      .trim()
      .nonempty({ message: 'La cédula es requerida' })
      .regex(/^\d{7,15}$/, { message: 'La cédula debe ser un número válido' }),
    direccion: z.string()
      .trim()
      .nonempty({ message: 'La dirección es requerida' })
      .max(150, { message: 'La dirección no puede tener más de 150 caracteres' }),
  });

export const manejarValidaciones = (event, setOpen) => {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  proveedorSchema.safeParseAsync(data)
    .then(parsedData => {
      if (parsedData.success) {
        console.log('Datos validados:', parsedData.data);
      } else {
        console.log('Errores de validación:', parsedData.error.formErrors.fieldErrors);
      }
    });
};
