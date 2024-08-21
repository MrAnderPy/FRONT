import * as XLSX from 'xlsx';

export function generarExcel(data) {
    const hojaData = data.map(usuario => ({
        ID: usuario.id_usuario,
        Nombre: usuario.nombre,
        Apellido: usuario.apellido,
        Cedula: usuario.cedula,
        Correo: usuario.correo,
        Telefono: usuario.telefono,
        Rol: usuario.nombre_rol,
        Estado: usuario.estado=="Activo" ? "Activo" : "Inactivo"      
    }));

    const hoja = XLSX.utils.json_to_sheet(hojaData);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Usuarios');
    XLSX.writeFile(libro, 'reporteUsurio.xlsx');
}