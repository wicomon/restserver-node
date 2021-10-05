const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, getProducto, getProductos, deleteProducto, updateProducto } = require('../controllers/productos');
const { existeProducto } = require('../helpers/db-validators');
const {validarCampos, validarJWT, esAdminRole} = require('../middleware');

const router = Router();

//obtener todas las productos - publico
router.get('/',
    getProductos
);

//obtener una Productos por id - publico
router.get('/:id', 
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    getProducto
);

//crear Producto - privado - token necesario
router.post('/', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearProducto
);

//actualizar Producto - privado - token necesario
router.put('/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProducto),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    updateProducto
)

//borrar Producto - privado - token necesario
router.delete('/:id',
    [
        validarJWT,
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    deleteProducto
);





module.exports = router;