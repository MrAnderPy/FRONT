import React from "react";

import {Aside} from "../components/Aside"
import {
  Navbar,
  MobileNav,
  Typography,
  Collapse,
  Button,
  IconButton,
} from "@material-tailwind/react";
 
export function Nav() {
  const [openNav, setOpenNav] = React.useState(false);
 
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);
 
  const navList = (
    <ul className="mt-4 mb-2 mr-8 flex flex-col gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8">
      
   
      
    </ul>
  );
 
  return (
    <>
    
  <Navbar  className="max-w-full w-full flex justify-between">

      <div className="container mx-8 flex items-center justify-between text-blue-gray-900">
        
        <Typography
          as="a"
          href="/catalogo"
          className="mr-2 cursor-pointer font-medium"
        >
          <img src="/images/logo.png" className="w-16 h-16" />
        </Typography>
        <div className="hidden lg:block">{navList}</div>
      
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex items-center gap-x-1">
            
          </div>
        </div>
      </Collapse>
    </Navbar></>
  );
}