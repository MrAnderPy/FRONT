const apiUrl = import.meta.env.VITE_API_URL;
export const obtenerRoles = async () => {
    try {
        const response = await fetch(`${apiUrl}/consultar_roles`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener roles:', error);
        throw new Error('Error al obtener roles');
    }
};