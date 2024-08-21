// src/api/fetchData2.js
const fetchData2 = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }

  return response.json();
};

export default fetchData2;
