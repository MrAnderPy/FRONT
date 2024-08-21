import { z } from 'zod';

export const clienteSchema = z.object({
  nombre_cliente: z.string()
  .nonempty({ message: 'El nombre es requerido' })
  .max(50, { message: 'El nombre no puede tener más de 50 caracteres' }),
id: z.string()
  .nonempty({ message: 'La cédula es requerida' })
  .regex(/^\d+$/, { message: 'La cédula debe contener solo números' }),
correo: z.string()
  .nonempty({ message: 'El correo es requerido' })
  .email({ message: 'El correo no es válido' }),
telefono: z.string()
  .nonempty({ message: 'El teléfono es requerido' })
  .regex(/^\d+$/, { message: 'El teléfono debe contener solo números' }),
});

export const manejarValidaciones = (event, setOpen) => {
event.preventDefault();

const formData = new FormData(event.target);
const data = Object.fromEntries(formData);


  clienteSchema.safeParseAsync(data)
    .then(parsedData => {
      if (parsedData.success) {
        console.log('Datos validados:', parsedData.data);
      } else {
        console.log('Errores de validación:', parsedData.error.formErrors.fieldErrors);
      }
    });
};
