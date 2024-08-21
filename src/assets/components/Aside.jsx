import React, { useState, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Button,
  Drawer,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  PowerIcon,
  UsersIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { ThemeProvider } from "@material-tailwind/react";
import { theme } from "../../Theme"; // Asegúrate de que la ruta sea correcta

const modules = [
  { id: 1, name: 'Dashboard', icon: UsersIcon, path: '/dashboard' },
  { id: 2, name: 'Roles', icon: ChevronRightIcon, path: '/roles' },
  { id: 3, name: 'Usuarios', icon: ChevronRightIcon, path: '/usuarios' },
  { id: 4, name: 'Pedidos', icon: ChevronRightIcon, path: '/pedidos' },
  { id: 5, name: 'Ventas', icon: ChevronRightIcon, path: '/ventas' },
  { id: 6, name: 'Clientes', icon: ChevronRightIcon, path: '/clientes' },
  { id: 7, name: 'Compras', icon: ChevronRightIcon, path: '/compras' },
  { id: 8, name: 'Categorias', icon: ChevronRightIcon, path: '/categorias' },
  { id: 9, name: 'Productos', icon: ChevronRightIcon, path: '/productos' },
  { id: 10, name: 'Proveedores', icon: ChevronRightIcon, path: '/proveedores' },
];

export function Aside() {
  const { access, logout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const accessibleModules = Array.isArray(access) ? 
    modules.filter(module =>
      access.some(access => access.id_modulo === module.id && access.acceso === 1)
    ) : [];


  return (
    <ThemeProvider value={theme}>
      <React.Fragment>
        {/* Fondo negro con opacidad para cubrir toda la pantalla */}
        {drawerOpen && (
          <div className="fixed inset-0 w-full h-full bg-black bg-opacity-60 backdrop-blur-sm z-[9995] pointer-events-auto" style={{ opacity: 1 }} onClick={closeDrawer}></div>
        )}
        <div className='absolute top-0 mt-6'>
          <button className='border-solid border-2 border-sky-500 p-2 rounded py-2 z-40 ml-2' onClick={openDrawer}>
            <Bars3Icon className="h-5 w-5 " />
          </button>
        </div>
        <Drawer open={drawerOpen} onClose={closeDrawer} className="p-4">
          <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-2 shadow-xl shadow-blue-gray-900/5 px-2">
            <div className="mb-2 p-4">
              {/* Aquí podrías agregar un título o logo */}
            </div>
            <List>
              {accessibleModules.map(module => (
                <a href={module.path} key={module.id}>
                  <ListItem>
                    <ListItemPrefix>
                      <module.icon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                      {module.name}
                    </Typography>
                  </ListItem>
                </a>
              ))} 
<a href="/">
              <ListItem onClick={logout}>
                <ListItemPrefix>
                  <PowerIcon className="h-5 w-5 text-red-500" />
                </ListItemPrefix>
                <Typography color="red" className="mr-auto font-normal">
                  Cerrar
                </Typography>
              </ListItem> 
</a>
            </List>
          </Card>
        </Drawer>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default Aside;
