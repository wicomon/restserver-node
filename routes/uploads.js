const {Router} = require('express');
const {check} = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middleware');
const {cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudDinary} = require('../controllers/uploads');
const { collecionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', 
    [
        validarArchivoSubir
    ], 
    cargarArchivo
);

router.put('/:coleccion/:id', 
    [
        check('id', 'El id debe ser de MongoDB').isMongoId(),
        validarArchivoSubir,
        check('coleccion').custom(c => collecionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ], 
    // actualizarImagen
    actualizarImagenCloudDinary
);

router.get('/:coleccion/:id',
    [
        check('id', 'El id debe ser de MongoDB').isMongoId(),
        check('coleccion').custom(c => collecionesPermitidas(c, ['usuarios', 'productos'])),
        validarCampos
    ],
    mostrarImagen
)

module.exports = router;