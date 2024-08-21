import React, { useContext } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { AuthContext } from "../../AuthContext";

export function NavUser() {
  const [openNav, setOpenNav] = React.useState(false);
  const { token } = useContext(AuthContext);
  const { access, logout } = useContext(AuthContext);

  React.useEffect(() => {
    window.addEventListener("resize", () => window.innerWidth >= 960 && setOpenNav(false));
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 max-h-full">
      {token && (
        <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
          <a href="/pedidos">
            <Button color="green" size="sm" className="w-48 h-12 mt-5">
              <span>Pedidos</span>
            </Button>
          </a>
          <Button color="green" size="sm" className="w-48 h-12 mt-4 m-5">
            <a href="/perfil" className="flex items-center ">
              Cuenta
            </a>
          </Button>
          <Button color="red" size="sm" className="w-48 h-12 mt-5" onClick={logout}>
            <a href="/" className="flex items-center">
              Cerrar sesión
            </a>
          </Button>
        </div>
      )}
    </ul>
  );

  return (
    <div className="max-w-full overflow-x-hidden">
      <Navbar className="max-w-full sticky top-0 z-10 h-max w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex text-blue-gray-900">
          <Typography as="a" href="/" className="mr-4 cursor-pointer py-1.5 font-medium">
            <img src="/images/logo.png" className="h-16 w-16 mt-2" alt="Logo" />
          </Typography>
          <div className="hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            {!token && (
              <div className="justify-end">
                <a href="/inicio">
                  <Button color="green" size="sm" className="hidden lg:inline-block w-48 h-12 mt-2 mr-2">
                    <span>Login</span>
                  </Button>
                </a>
                <a href="/registro">
                  <Button color="green" size="sm" className="hidden lg:inline-block w-48 h-12 mt-2">
                    <span >Registro</span>
                  </Button>
                </a>
              </div>
            )}
          </div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </IconButton>
        </div>
        <MobileNav open={openNav}>
          {!token && (
            <div className="flex items-center gap">
              <a href="/inicio">
                <Button fullWidth variant="text" size="sm">
                  <span>Log In</span>
                </Button>
              </a>
              <a href="/registro">
                <Button fullWidth variant="text" size="sm">
                  <span>Registro</span>
                </Button>
              </a>
            </div>
          )}
          {token && (
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/pedidos">
                <Button variant="" size="sm" className="w-48 h-12 mt-5">
                  <span>Pedidos</span>             </Button>
              </a>
              <Button variant="" size="sm" className="w-48 h-12 mt-4 m-5">
                <a href="/perfil" className="flex items-center ">
                  Cuenta
                </a>
              </Button>
              <Button variant="" size="sm" className="w-48 h-12 mt-4 m-5" onClick={logout}>
                <a href="/" className="flex items-center">
                  Cerrar sesión
                </a>
              </Button>
            </div>
          )}
        </MobileNav>
      </Navbar>
    </div>
  );
}