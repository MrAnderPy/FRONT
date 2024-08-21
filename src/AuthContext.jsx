import React, { createContext, useState } from "react";

export const AuthContext = createContext();



const parseJSON = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [access, setAccess] = useState(() => {
    const savedAccess = localStorage.getItem("access");
    return savedAccess ? parseJSON(savedAccess) : {};
  });
  const [idCliente, setIdCliente] = useState(() => {
    const savedIdCliente = localStorage.getItem("id_cliente");
    return savedIdCliente ? parseJSON(savedIdCliente) : null;
  });
  const [tipo, setTipo] = useState(() => {
    const savedTipo = localStorage.getItem("tipo");
    return savedTipo ? parseJSON(savedTipo) : null;
  });
  
  const [tipoCliente, setTipoCliente] = useState(() => {
    const savedTipoCliente = localStorage.getItem("tipoCliente");
    return savedTipoCliente? parseJSON(savedTipoCliente) : null;
  });

  const login = (newToken, accessData, idCliente, tipo, tipoCliente) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setAccess(accessData);
    localStorage.setItem("access", JSON.stringify(accessData));
    setIdCliente(idCliente);
    localStorage.setItem("id_cliente", JSON.stringify(idCliente));
    setTipo(tipo);
    localStorage.setItem("tipo", JSON.stringify(tipo));

    setTipoCliente(tipoCliente);
    localStorage.setItem("tipoCliente", JSON.stringify(tipoCliente));
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setAccess({});
    localStorage.removeItem("access");
    setIdCliente(null);
    localStorage.removeItem("id_cliente");
    setTipo(null);
    localStorage.removeItem("tipo");
    setTipoCliente(null);
    localStorage.removeItem("tipoCliente");
  
  };

  return (
    <AuthContext.Provider value={{ token, access, idCliente, tipo,  tipoCliente, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
