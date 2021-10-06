const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta='') => {
    
    return new Promise( (resolve, reject) => {

         // console.log('req.files >>>', req.files); // eslint-disable-line
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es soportada - ${extensionesValidas}`);
        }

        const nombreTemp = uuidv4()+'.'+extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });

    });
   
}

module.exports = {
    subirArchivo
}