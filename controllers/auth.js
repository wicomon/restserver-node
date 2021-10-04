const {response, json} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



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

const googleSignIn = async(req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);
        // console.log(googleUser);
        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            //si no existe se crea usuario
            const data = {
                nombre,
                correo,
                password: ':v:V:Vxd',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el usuario en db
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado de la bd'
            });
        }

        // generar el JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token,
            ok : 'ok'
        })
    } catch (error) {
        res.status(400).json({
            msg: 'El token no se pudo verificar',
            ok : false
        })
    }

}

module.exports = {
    login,
    googleSignIn
}