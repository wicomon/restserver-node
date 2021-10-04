const {Router} = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middleware/validar-campos');
// const { validarJWT } = require('../middleware/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middleware/validar-roles');
const {validarCampos, validarJWT, tieneRole} = require('../middleware');


const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/users');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet);

router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe contener mas de 6 letras').isLength({min:6}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom(emailExiste),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROL', 'USER_ROL']),
        check('rol').custom(esRoleValido), //lo mismo q .custom(rol => esRoleValido(rol)), funcion cuyo primer argumento es el mismo argumento q se envia, automanticamente el primer argumento se pasa al role
        validarCampos
    ] ,
    usuariosPost
);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
],usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
], usuariosDelete);



module.exports = router;