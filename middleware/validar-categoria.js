const {response} = require('express');

const tieneCategoria = (req, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Token no existente'
        });
    }

    const {rol, nombre} = req.usuario;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'No estas autorizado para realizar esta acción'
        });
    }
    next();
    // console.log(req.usuario)
}



module.exports = {
    tieneCategoria
}