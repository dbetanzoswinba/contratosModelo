import { convertirDOCaPDF, obtenerDocumentos } from "./controllers/ContratoModelo.js";
import {  leerExcel } from "./controllers/documentoControler.js";
import { generarContrato } from "./controllers/ordenServicio.js";

let data = leerExcel('./registro.xlsx');
console.log(data);

data.forEach( async ods =>{
    await generarContrato(ods);
});


const init = async ()=>{
    const contratos = obtenerDocumentos().map(contrato => contrato.includes('.docx') ? contrato : null);
    console.log(contratos);
    const bandera = true;
    let contador = 0;
    console.log(contratos.length);
    while(contratos.length > 0){
        let contrato = contratos.pop();
        if(contrato!== null ){
            const bandera = await convertirDOCaPDF(contrato)
            console.log(bandera);
        }
    }
}

init();
// contratos.forEach(contrato =>{
//     const promises = [];
//     if(contrato){
//         promises.push(convertirDOCaPDF(contrato));
//     }
// });

