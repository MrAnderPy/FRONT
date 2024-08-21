import { Aside } from '../components/Aside.jsx'
import { Nav } from '../components/Nav.jsx'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { TabRoles } from '../components/roles/TabRoles.jsx'
import { Footer } from '../components/Footer.jsx'
import { useState } from 'react'
export function Roles() {
  const { token, access } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verificar si el token está vacío
    if (!token) {
      navigate('/');
      return;
    }

    // Verificar si el usuario tiene acceso al módulo 'Clientes'
    const hasAccessToClientes = access.some(
      (module) => module.id_modulo == 2 && module.acceso == 1
    );

    if (!hasAccessToClientes) {
      // Redirigir a la ruta principal si no tiene acceso
      navigate('/');
    } else {
      // Si tiene acceso, cambiar el estado a autorizado
      setIsAuthorized(true);
    }
  }, [token, access, navigate]);

  // Renderizar un loader o un mensaje mientras se verifica el acceso
  if (!isAuthorized) {
    return <div>Loading...</div>;
  }
  return (
    <>
    
    <Nav />
    <TabRoles/>
    <Aside/>
    <Footer />
   
    </>
  )
}

