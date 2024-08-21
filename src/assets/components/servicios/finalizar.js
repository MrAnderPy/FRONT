export const finalizar = (urlBase, id, estadoActual, ) => {
    const url = `${urlBase}${id}`;
    const nuevoEstado = estadoActual == 1 ? 2 : 1; // Invertir el estado
  
    return fetch(url, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }), // Pasar el nuevo estado invertido
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  