import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generarExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Proveedores"); // Cambiar el nombre de la hoja si es necesario

  // Definir estilos
  const titleStyle = {
    font: { name: "Arial", bold: true, size: 16, color: { argb: "FFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "40D912" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const columnStyle = {
    font: { name: "Arial", bold: true, size: 10, color: { argb: "FFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "40D912" } },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const infoStyle = {
    font: { name: "Arial", size: 10, color: { argb: "000000" } },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const fecha = new Date();
  const formatoFecha = fecha.toLocaleDateString();
  const fechaTiempo = fecha.toLocaleTimeString();

  // Mapear los datos a un formato adecuado para Excel
  const hojaData = data.map((proveedor) => [
    proveedor.id_proveedor,
    proveedor.nombre_empresa,
    proveedor.telefono_contacto,
    proveedor.nit,
    proveedor.sello,
    proveedor.cedula,
    proveedor.direccion,
    proveedor.tipo_proveedor=="Natural" ? "Natural" : "Juridico",      
    proveedor.estado=="Activo" ? "Activo" : "Inactivo" 
  ]);

  // Encabezado bonito con fecha y hora de creación en una nueva línea
  sheet.mergeCells("A1:I3");
  const headerCell = sheet.getCell("A1");
  headerCell.value = `Reporte de Proveedores\nFecha y Hora de Creación: ${formatoFecha} ${fechaTiempo}`;
  headerCell.style = titleStyle;
  headerCell.alignment = { wrapText: true, horizontal: 'center', vertical: 'center' };

  sheet.addRow([]);
  sheet.addRow([]);
  // Encabezados
  sheet.getCell("A6").value = "ID";
  sheet.getCell("B6").value = "Nombre Empresa";
  sheet.getCell("C6").value = "Telefono contacto";
  sheet.getCell("D6").value = "Nit";
  sheet.getCell("E6").value = "Sello";
  sheet.getCell("F6").value = "Cedula";
  sheet.getCell("G6").value = "Direccion";
  sheet.getCell("H6").value = "Tipo Proveedor";
  sheet.getCell("I6").value = "Estado";

  // Aplicar estilos
  sheet.getCell("A6").style = columnStyle;
  sheet.getCell("B6").style = columnStyle;
  sheet.getCell("C6").style = columnStyle;
  sheet.getCell("D6").style = columnStyle;
  sheet.getCell("E6").style = columnStyle;
  sheet.getCell("F6").style = columnStyle;
  sheet.getCell("G6").style = columnStyle;
  sheet.getCell("H6").style = columnStyle;
  sheet.getCell("I6").style = columnStyle;

    // Aplicar estilos para los datos
    sheet.addRows(hojaData);

    hojaData.forEach((_, index) => {
      sheet.getRow(index + 7).eachCell(cell => {
        cell.style = infoStyle;
      });
    });
  
    const finalRowIndex = hojaData.length + 7;
    sheet.addRow([]);
  
    // Ajuste de ancho de columnas
    sheet.columns = [
      { key: 'A', width: 20 },
      { key: 'B', width: 30 },
      { key: 'C', width: 30 },
      { key: 'D', width: 30 },
      { key: 'E', width: 30 },
      { key: 'F', width: 30 },
      { key: 'G', width: 30 },
      { key: 'H', width: 30 },
      { key: 'I', width: 15 }
    ];
    // Añadir filtro a la columna "Estado"
    sheet.autoFilter = {
      from: 'A6',
      to: `I${finalRowIndex - 1}`
    };

  // Guardar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "Proveedores.xlsx"); // Cambiar el nombre del archivo si es necesario
}
