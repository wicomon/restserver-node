const { response } = require("express")


const validarArchivoSubir = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ msg: 'No se envio ningun archivo.' });
    }

    if (!req.files.archivo) {
        return res.status(400).json({ msg: 'El archivo enviado debe llamarse "Archivo".' });  
    }

    next();
}

module.exports = {
    validarArchivoSubir
}