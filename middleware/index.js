const validaCampos  = require('../middleware/validar-campos');
const validaJWT = require('../middleware/validar-jwt');
const validaRoles = require('../middleware/validar-roles');
const  validarArchivoSubir  = require('../middleware/validar-archivo');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validarArchivoSubir
}