import FirmamexServices from '../firmamex.cjs';
let webId = 'tDZlvpI4OO6iurgW';
let apiKey = '0ed348de01c354ffd7e9a03527ed4a30';

const services = FirmamexServices(webId, apiKey);

export const enviarFlujoPDF = async (documento)=>{

    const { data, nombre, notificados } = documento;

    return await services.request({
        b64_doc: {
            data: data,
            name: `${nombre}`
        },
        workflow: {
            subject: `Se ha iniciado un flujo de firmas para el siguiente contrato modelo ${nombre}`,
            message: `Contrato Modelo ${nombre}`,
            expiration_date: '01/01/2023',
            remind_every: '1d',
            language: 'es',
            attach_files: true,
            watchers: notificados
        }   
    });
}