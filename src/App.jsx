import { Roles } from './assets/pages/Roles'
import { Usuarios } from './assets/pages/Usuarios'
import { Dashboard } from './assets/pages/Dashboard'
import { Categorias } from './assets/pages/Categorias'
import { Route, Routes } from 'react-router-dom'
import { Productos } from './assets/pages/Productos'
import { Proveedores } from './assets/pages/Proveedores'
import { Compras } from './assets/pages/Compras'
import Login from './assets/pages/Login'

import { Catalogo } from './assets/pages/Catalogo'

import {Ventas} from './assets/pages/Ventas'
import { Clientes } from './assets/pages/Clientes'
import Perfil from './assets/pages/Perfil'
import { Pedidos } from './assets/pages/Pedidos'
import  IniciarSesion  from './assets/components/usuarios/InicioSesion'
import { Registro } from './assets/components/usuarios/Registro'
import { AuthProvider } from './AuthContext'
import { CarritoProvider } from './assets/components/ContextCarrito'
import {LandingPage} from './assets/pages/LandingPage'
function App() {
return (
  
<AuthProvider>
    <CarritoProvider>
<Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/catalogo" element={<Catalogo />} />
<Route path="/usuarios" element={<Usuarios />} />
<Route path="/inicio" element={<IniciarSesion />} />
<Route path="/registro" element={<Registro />} />
<Route path="/roles" element={<Roles />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/categorias" element={<Categorias />} />
<Route path="/productos" element={<Productos />} />
<Route path="/proveedores" element={<Proveedores />} />
<Route path="/compras" element={<Compras />} />
<Route path="/login" element={<Login />} />
<Route path="/ventas" element={<Ventas />} />
<Route path="/clientes" element={<Clientes />} />
<Route path="/pedidos" element={<Pedidos />} />
<Route path="/perfil" element={<Perfil />} />
</Routes></CarritoProvider>
</AuthProvider>
);
}

export default App;
