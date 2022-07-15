import { convertirDOCaPDF, obtenerDocumentos } from "./controllers/ContratoModelo.js";
import {  convertirBase64, leerExcel } from "./controllers/documentoControler.js";
import { enviarFlujoPDF } from "./controllers/enviarFirmar.js";
import { generarContrato } from "./controllers/ordenServicio.js";
import fs  from 'fs';


const generarDocumentos = () =>{
    let data = leerExcel('./registro.xlsx');
    console.log(data);
    data.forEach( async ods =>{
        await generarContrato(ods);
    });
}


const init = async ()=>{
    const carpetaDocumentos ='./docs';
    const contratos = obtenerDocumentos(carpetaDocumentos).map(contrato => contrato.includes('.docx') ? contrato : null);
    while(contratos.length > 0){
        let contrato = contratos.pop();
        if(contrato!== null ){
            const bandera = await convertirDOCaPDF(contrato)
            console.log(bandera);
        }
    }
}
let contador = 0;
const enviarFirmamex = async () =>{
    const pathPdfs = './docs/pdfs';
    const contratosPDF = obtenerDocumentos(pathPdfs);
    let respuestas = [];
    while(contratosPDF.length > 0){
        try {
            let contrato = contratosPDF.pop();
            const documento = {
                data: await convertirBase64(contrato),
                nombre : contrato,
                notificados : [ 'dbetanzos@glwinba.com', 'cfonseca@glwinba.com' ]
            }
            let response = await enviarFlujoPDF(documento);
            console.log(response);
            console.log(`************************** ${contrato} ** ${contador++}******************** `);
            respuestas.push(response);
        } catch (error) {
            console.log(error)
        }
    }
    fs.writeFile(`./reportes/${Date.now()}.txt`,JSON.stringify(respuestas),(err)=>{
        if (err) throw err;
        console.log('Creado');
    });
}
generarDocumentos();
init();
await enviarFirmamex();



