const { response, json } = require('express');
const {Categoria} = require('../models');


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    console.log(req.usuario);
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe.`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // guardar en la db
    await categoria.save();


    res.status(201).json({
        categoria
    });
}

//obtener categorias - paginado - total - populate
const getCategorias = async (req, res = response) => {
    // const { q, nombre = 'no name', apikey, page = 1, limit = 10 } = req.query;
    const {limit = 5, desde=0} = req.query;

    if (isNaN(limit) || isNaN(desde)) {
        return res.status(400).json({msg:'parametros erroneos'});
    }
    
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments({estado: true}),
        Categoria.find({estado:true}).select('-__v').select('-estado')
            .skip(Number(desde))
            .limit(Number(limit))
    ]);
    // console.log(total);

    res.json({
        total,
        categorias
    })
}

// obtener categoria - populate {}
const getCategoria = async (req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).select('-__v').populate('usuario', 'nombre');
    // console.log(categoria);

    res.json({
        categoria
    })
}

// actualizar categoria
const updateCategoria = async(req, res = response) => {
    const {id} = req.params; // params es lo q viene en el url
    const {estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    // console.log(req.usuario.id);
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data ,{new: true});
    // console.log(nombre);
    res.json({
        categoria
    });
};

// borrar categoria - estado :false 
const deleteCategoria = async(req, res = response) => {
    const {id } = req.params;
    // console.log('el id es : '+id);
    // Fisicamente lo borramos
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false} ,{new: true});

    res.json({
        categoria
    });
};

module.exports = {
    crearCategoria,
    getCategoria,
    getCategorias,
    updateCategoria,
    deleteCategoria
}