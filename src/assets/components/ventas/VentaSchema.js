// src/assets/components/ventas/VentaSchema.js
import { z } from 'zod';

export const ventaSchema = z.object({
  cantidad: z.number().positive({ message: 'La cantidad debe ser un número positivo' }),
  precio: z.number().positive({ message: 'El precio unitario debe ser un número positivo' }),
});
