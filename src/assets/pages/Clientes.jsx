import { Aside } from '../components/Aside.jsx';
import { Nav } from '../components/Nav.jsx';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer.jsx';
import { TabClientes } from '../components/clientes/TabClientes.jsx';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../AuthContext.jsx';


export function Clientes() {
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
      (module) => module.id_modulo == 6 && module.acceso == 1
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
      <TabClientes />
      <Aside />
      <Footer />
    </>
  );
}
