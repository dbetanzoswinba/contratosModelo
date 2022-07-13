import XLSX from 'xlsx';
let dataExcel = []

export function leerExcel(documento){
    const workbook = XLSX.readFile(documento);
    const workbookSheets = workbook.SheetNames;
    dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[workbookSheets[0]]);
    return dataExcel
}