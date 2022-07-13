import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from 'fs';
import convertir from 'numero-a-letras';


export const generarContrato = async (data)=>{
    
    const fechaInicio = data.inicio;
    const fechaFin = data.fin;
    const fechaActual = data.fecha_actual;

    const {dia : dInicio, mes : mInicio , anio : aInicio } = convertirFecha(fechaInicio);
    data.dInicio = dInicio;
    data.mInicio = mInicio;
    data.aInicio = aInicio;

    const {dia : dFin, mes : mFin , anio : aFin } = convertirFecha(fechaFin);
    data.dFin = dFin;
    data.mFin = mFin;
    data.aFin = aFin;

    const {dia : dActual, mes : mActual , anio : aActual } = convertirFecha(fechaActual);
    data.dActual = dActual;
    data.mActual = mActual;
    data.aActual = aActual;

    const numeroTrabajadores = data.trabajadores;
    data.trabajadoresLetra = convertir.NumerosALetras(numeroTrabajadores).split(' ')[0].toLowerCase();
    
    console.log(data);

    const content = fs.readFileSync(
        "./ContratoMoralMTY.docx",
        "binary"
    );
    console.log(data);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });
    doc.render(data);
    const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });
    fs.writeFile(`./docs/Contrato_Modelo-${data.oc}.docx`,buf, (err) => {
        if (err) throw err;
        console.log("Archivo generado correctamente");
    }); 
} 

const convertirFecha = (fecha)=>{
    
    const meses = {
      "01":"Enero",
      "02":"Febrero",
      "03":"Marzo",
      "04":"Abril",
      "05":"Mayo",
      "06":"Junio",
      "07":"Julio",
      "08":"Agosto",
      "09":"Septiembre",
      "10":"Octubre",
      "11":"Noviembre",
      "12":"Diciembre",
    }

    const data = fecha.split('/');

    return {
      dia:data[0],
      mes:meses[data[1]],
      anio:`20${data[2]}`
    }
  }