const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, getCategorias, getCategoria, deleteCategoria, updateCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const {validarCampos, validarJWT, esAdminRole} = require('../middleware');

const router = Router();

//obtener todas las categorias - publico
router.get('/',
    getCategorias
);

//obtener una categorias por id - publico
router.get('/:id', 
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    getCategoria
);

//crear categoria - privado - token necesario
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearCategoria
);

//actualizar categoria - privado - token necesario
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoria),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    updateCategoria
)

//borrar categoria - privado - token necesario
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    deleteCategoria
);





module.exports = router;