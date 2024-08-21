import React, { useState } from 'react';
import {
    CardHeader,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";

export function TarjetaCarrito({ id_producto, foto, nombre_producto, valor_compra, cantidad, setCarrito }) {
    const [customQuantity, setCustomQuantity] = useState(cantidad > 10 ? cantidad : '');
    const [selectedOption, setSelectedOption] = useState(cantidad > 10 ? '10+' : cantidad.toString());

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        if (value === '0') {
            // Eliminar producto
            setCarrito(prevCarrito => prevCarrito.filter(item => item.id_producto !== id_producto));
        } else if (value === '10+') {
            // Mostrar input para cantidad personalizada
            setCustomQuantity('');
        } else {
            // Actualizar cantidad
            setCarrito(prevCarrito => prevCarrito.map(item =>
                item.id_producto === id_producto
                    ? { ...item, cantidad: parseInt(value) }
                    : item
            ));
        }
    };

    const handleCustomQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 0) {
            setCustomQuantity(value);
            setCarrito(prevCarrito => prevCarrito.map(item =>
                item.id_producto === id_producto
                    ? { ...item, cantidad: value }
                    : item
            ));
        }
    };

    const handleRemove = () => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id_producto !== id_producto));
    };

    return (
        <div className="flex bg-blue-gray-100 mb-2 rounded-lg items-center">
            <CardHeader shadow={false} floated={false} className="h-16 w-16 mt-8">
                <img src={foto} alt={nombre_producto} className="h-full w-full object-cover" />
            </CardHeader>
            <div className='p-4 flex flex-col justify-between w-full'>
                <Typography variant="h6" color="blue-gray">{nombre_producto}</Typography>

                <div className="mb-2 flex items-center">
                    {selectedOption !== '10+' ? (
                        <select
                            value={selectedOption}
                            onChange={handleSelectChange}
                            className="border border-blue-gray-300 rounded-lg px-2 py-1 mr-2"
                        >
                            {[...Array(10).keys()].map(i => (
                                <option key={i} value={i}>{i}</option>
                            ))}
                            <option value="10+">10+</option>
                        </select>
                    ) : (
                        <input
                            type="number"
                            min="11"
                            value={customQuantity}
                            onChange={handleCustomQuantityChange}
                            className="border border-blue-gray-300 rounded-lg px-4 py-2 w-24 mr-2 text-lg"
                            placeholder="Cantidad"
                        />
                    )}

                    <IconButton onClick={handleRemove} color="red" variant="text">
                        <TrashIcon className="h-5 w-5" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}
