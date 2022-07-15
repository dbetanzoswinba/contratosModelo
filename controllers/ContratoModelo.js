import path from 'path';
import fs from 'fs';
import libre from 'libreoffice-convert';
import util from 'util';

libre.convertAsync = util.promisify(libre.convert);

export const obtenerDocumentos = (carpetaDocumentos)=>{
    return fs.readdirSync(carpetaDocumentos);

}

export const convertirDOCaPDF = (documento)=>{
    return new Promise(async (resolve)=>{
        console.log(documento);
        const doc = `./docs/${documento}`;
        const nombreDocumento = documento.split('.');
        const ext = '.pdf'
        const outputPath = `./docs/pdfs/${nombreDocumento[0]}${ext}`;
        const docxBuf = await fs.promises.readFile(doc);
        let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        await fs.promises.writeFile(outputPath, pdfBuf);
        resolve(`convertido...!! ${documento}`);
    });
}