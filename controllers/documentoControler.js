import XLSX from 'xlsx';
import fs from 'fs';
import { resolve } from 'path';
import { rejects } from 'assert';
let dataExcel = []

export function leerExcel(documento){
    const workbook = XLSX.readFile(documento);
    const workbookSheets = workbook.SheetNames;
    dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[workbookSheets[0]]);
    return dataExcel
}


export const convertirBase64 = async (documento)=>{
    return new Promise( (resolve) =>{
        const doc = `./docs/pdfs/${documento}`;
        let binaryData = fs.readFileSync(doc);
        resolve(new Buffer(binaryData).toString('base64'));
    })
}