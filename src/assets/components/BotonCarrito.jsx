import React from 'react';
import { Button, Drawer, ThemeProvider, Typography } from "@material-tailwind/react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { TarjetaCarrito } from './TarjetaCarrito';
import { useCarrito } from './ContextCarrito';
import theme from '@material-tailwind/react/theme';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
const apiUrl = import.meta.env.VITE_API_URL;
export function BotonCarrito() {
    const { token, idCliente, tipo, tipoCliente } = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);
    const { carrito, setCarrito } = useCarrito();
    console.log(idCliente)
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    const enviarPedido = async () => {
        const pedido = {
            id_cliente: idCliente, // Reemplaza esto con el ID del cliente real
            detalle_pedidos: carrito.map(producto => ({
                id_producto: producto.id_producto,
                cantidad: producto.cantidad,
                precio_unitario: producto.valor_compra
            }))
        };

        try {
            const response = await fetch(`${apiUrl}/crear_pedido`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido)
            });

            const data = await response.json();
            if (data.estado) {
                Swal.fire("exito",data.msg, 'success');
                setCarrito([]); // Limpia el carrito después de enviar el pedido
                closeDrawer();
            } else {
                Swal.fire("Error", data.msg, 'error');
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            Swal.fire('Ocurrió un error al enviar el pedido');
        }
    };
    if (!idCliente) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                {open && (
                    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm z-[9995] pointer-events-auto" style={{ opacity: 1 }} onClick={closeDrawer}></div>
                )}
                <div className="fixed z-50 bottom-0 right-2">
                    <Button onClick={openDrawer} variant="gradient" className="mx-2 right-0 m-10">
                        <ShoppingCartIcon strokeWidth={2} className="h-4 w-4"/>
                    </Button>
                </div>

                <Drawer open={open} onClose={closeDrawer} className="overflow-y-auto">
                    <div className="text-center mt-5 mb-2"><strong>Carrito de Compras</strong></div>
                    {carrito.map((producto, index) => (
                        <TarjetaCarrito key={index} {...producto} setCarrito={setCarrito} />
                    ))}
                    <Button className="justify-items-center mx-16 mt-6" onClick={enviarPedido}>Enviar pedido</Button>
                </Drawer>
            </React.Fragment>
        </ThemeProvider>
    );
}

export default BotonCarrito;