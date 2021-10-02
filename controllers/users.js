const { response, request } = require("express"); //redundante para q vscode reconozca los tags
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {
    // const { q, nombre = 'no name', apikey, page = 1, limit = 10 } = req.query;
    const {limit = 5, desde=1} = req.query;
    if (isNaN(limit) || isNaN(desde)) {
        return res.status(400).json({msg:'parametros erroneos'});
    }
    // const usuarios = await Usuario.find({estado:true})
    //                             .skip(Number(desde))
    //                             .limit(Number(limit)); 

    // const total = await Usuario.countDocuments({estado: true});

    //lo mismo que arriba pero mas rapido xq la promesa envia las 2 al mismo tiempo
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado: true}),
        Usuario.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limit))
    ]);
    // console.log(total);
    res.json({
        total,
        usuarios
    });
};

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password , rol});

    // encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar el nuevo usuarios
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = async(req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    //validar contra BD 
    if (password) {
        // encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "PATCH api - controlador",
    });
};

const usuariosDelete = async(req, res = response) => {
    const {id } = req.params;

    // Fisicamente lo borramos
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json({
        usuario
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
