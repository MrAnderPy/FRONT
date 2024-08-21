import {
  Navbar,
  Typography,
  Button
} from "@material-tailwind/react";
import React from 'react';
import { useMediaQuery } from 'react-responsive';

export function NavLanding() {
  const isMobile = useMediaQuery({ query: '(max-width: 750px)' });

  return (
    <div className="max-w-full">
      <Navbar className="max-w-full sticky top-0 z-10 h-max w-full rounded-none px-4 py-1 lg:px-6 lg:py-2 bg-[#f7f7f7f3]">
        <div className="flex justify-between items-center">
          <Typography as="a" href="/" className="mr-4 cursor-pointer py-1 font-medium">
            <img src="/images/logo.png" className="h-12 w-12 mt-1" alt="Logo" />
          </Typography>
          <div className="flex items-center gap-x-1">
            <div className="flex justify-end">
              <a href="/inicio">
                <Button variant="text" size="sm" className={`${isMobile ? '' : 'hidden lg:inline-block'} w-42 h-10 mt-1 mr-2 text-black hover:bg-[#5fdf2c]`}>
                  <span>Login</span>
                </Button>
              </a>
              <a href="/registro">
                <Button variant="text" size="sm" className={`${isMobile ? '' : 'hidden lg:inline-block'} w-42 h-10 mt-1 text-black hover:bg-[#5fdf2c]`}>
                  <span>Registro</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}
