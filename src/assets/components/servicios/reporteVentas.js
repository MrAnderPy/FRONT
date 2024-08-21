import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generarExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pedidos"); // Cambiar el nombre de la hoja si es necesario

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
  const hojaData = data.map((venta) => [
    venta.id_gestion,
    venta.nombre_cliente,
    venta.fecha_gestion,
    venta.total,
    venta.estado == 2 ? "pago" : "Anulada"
  ]);

 // Encabezado bonito con fecha y hora de creación en una nueva línea
 sheet.mergeCells("A1:E3");
 const headerCell = sheet.getCell("A1");
 headerCell.value = `Reporte de Ventas\nFecha y Hora de Creación: ${formatoFecha} ${fechaTiempo}`;
 headerCell.style = titleStyle;
 headerCell.alignment = { wrapText: true, horizontal: 'center', vertical: 'center' };

 sheet.addRow([]);
 sheet.addRow([]);
  // Encabezados
  sheet.getCell("A6").value = "ID Venta";
  sheet.getCell("B6").value = "Nombre Cliente";
  sheet.getCell("C6").value = "Fecha Venta";
  sheet.getCell("D6").value = "Total";
  sheet.getCell("E6").value = "Estado";

  // Aplicar estilos
  sheet.getCell("A6").style = columnStyle;
  sheet.getCell("B6").style = columnStyle;
  sheet.getCell("C6").style = columnStyle;
  sheet.getCell("D6").style = columnStyle;
  sheet.getCell("E6").style = columnStyle;

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
     { key: 'E', width: 15 }
   ];
 
   // Añadir filtro a la columna "Estado"
   sheet.autoFilter = {
     from: 'A6',
     to: `E${finalRowIndex - 1}`
   };

  // Guardar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "Ventas.xlsx"); // Cambiar el nombre del archivo si es necesario
}
