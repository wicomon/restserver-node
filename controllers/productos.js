const { response, json } = require('express');
const {Categoria, Producto} = require('../models');


const crearProducto = async (req, res = response) => {

    const {nombre, usuario, categoria, ...data} = req.body;

    data.nombre = nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const productoDB = await Producto.findOne({nombre : data.nombre});
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${nombre} ya existe.`
        })
    }

    const categoriaDB = await Categoria.findOne({nombre : categoria.toUpperCase()});
    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoria} no esta registrada.`
        })
    }else{
        data.categoria = categoriaDB._id;
    }
    
    const producto = new Producto(data);

    // guardar en la db
    await producto.save();


    res.status(201).json({
        producto
    });
}

//obtener categorias - paginado - total - populate
const getProductos = async (req, res = response) => {
    // const { q, nombre = 'no name', apikey, page = 1, limit = 10 } = req.query;
    const {limit = 5, desde=0} = req.query;

    if (isNaN(limit) || isNaN(desde)) {
        return res.status(400).json({msg:'parametros erroneos'});
    }
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments({estado: true}),
        Producto.find({estado:true}).populate('usuario', 'nombre').populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ]);
    // console.log(total);

    res.json({
        total,
        productos
    })
}

// obtener categoria - populate {}
const getProducto = async (req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    // console.log(producto);

    res.json({
        producto
    })
}

// actualizar categoria
const updateProducto = async(req, res = response) => {
    const {id} = req.params; // params es lo q viene en el url
    const {nombre, usuario, categoria, ...data} = req.body;

    data.nombre = nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaDB = await Categoria.findOne({nombre : categoria.toUpperCase()});
    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoria} no esta registrada.`
        })
    }else{
        data.categoria = categoriaDB._id;
    }
    try {
        const producto = await Producto.findByIdAndUpdate(id, data ,{new: true});
        // console.log(producto);
        res.json({
            producto
        });
        
    } catch (error) {
        res.status(400).json({
            msg : 'no se pudo modificar el producto',
            error : error.codeName
        })
    }

};

// borrar producto - estado :false 
const deleteProducto = async(req, res = response) => {
    const {id } = req.params;
    // console.log('el id es : '+id);
    // Fisicamente lo borramos
    const producto = await Producto.findByIdAndUpdate(id, {estado:false} ,{new: true});

    res.json({
        producto
    });
};

module.exports = {
    crearProducto,
    getProducto,
    getProductos,
    updateProducto,
    deleteProducto
}