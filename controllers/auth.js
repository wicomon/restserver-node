const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');



const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try {
        // Verificar si existe email
        const usuario = await Usuario.findOne({correo,estado:true});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            })
        }

        // Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        }

        // verificar la contraseña
        const validarPassword = bcrypt.compareSync(password, usuario.password);

        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password',
                
            })
        }

        // generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'Login ok',
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : 'error, algo salio mal'
        });
    }
}

module.exports = {
    login
}