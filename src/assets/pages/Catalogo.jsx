// src/components/catalogo.js

import React, { useEffect, useState, useContext } from 'react';
import { NavUser } from '../components/NavUser';
import { Carousell } from '../components/Carousel';
import { Tarjeta } from '../components/TarjetaProducto';
import { BotonCarrito } from '../components/BotonCarrito';
import Aside from '../components/Aside';
import { useCarrito } from '../components/ContextCarrito';
import { AuthContext } from '../../AuthContext';
import { Footer } from '../components/Footer.jsx'
const apiUrl = import.meta.env.VITE_API_URL;
export function Catalogo() {
  const { token, idCliente, tipo, tipoCliente } = useContext(AuthContext);
  const [apiData, setApiData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { agregarAlCarrito } = useCarrito();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 0 }).format(price);
  };
  

  console.log(tipoCliente);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${apiUrl}/consultar_catalogo_productos`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching products.');
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${apiUrl}/consultar_catalogo_categorias`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const categoriasActivas = data.filter(categoria => categoria.estado == 1);
      setCategorias(categoriasActivas);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error fetching categories.');
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const productosActivos = apiData.filter(producto => producto.estado == 1);

  const productosFiltrados = productosActivos.filter(producto => 
    (categoriaSeleccionada ? producto.nombre_categoria === categoriaSeleccionada : true) &&
    (searchTerm ? producto.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  const getPrice = (producto) => {
    return tipoCliente === 'mayorista' ? producto.valor_mayorista : producto.valor_unitario;
  };

  return (
    <>
      <Aside />
      <NavUser /> 
      <Carousell />
      <div className="mx-auto px-3 mt-10">
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={categoriaSeleccionada}
            onChange={e => setCategoriaSeleccionada(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Todas las Categorías</option>
            {categorias.map(({ id_categoria, nombre }) => (
              <option key={id_categoria} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
          <input
            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
            placeholder="Producto"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(({ id_producto, nombre_producto, nombre_categoria, valor_unitario, valor_mayorista, foto }) => (
              <Tarjeta 
              key={id_producto}
              id_producto={id_producto}
              foto={`${apiUrl}/${foto}`} 
              nombre_producto={nombre_producto} 
              nombre_categoria={nombre_categoria} 
              valor_compra={formatPrice(getPrice({ valor_unitario, valor_mayorista }))} 
              textoBotonCarrito="Agregar al carrito" 
              onAgregarAlCarrito={() => agregarAlCarrito({
                id_producto,
                nombre_producto,
                nombre_categoria,
                valor_compra: getPrice({ valor_unitario, valor_mayorista }),
                foto: `${apiUrl}/${foto}`
              })}
            />
            
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
        <BotonCarrito />
      </div>
        
    <Footer />
    </>
  );
}
