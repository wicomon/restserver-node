const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ msg: 'No files were uploaded.' });
        return;
    }

    if (!req.files.archivo) {
        res.status(400).json({ msg: 'No files were uploaded.' });
        return;
    }

    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Coleccion no configurada'
            })
            break;
    }

    // limpiar imagenes previas 
    if (modelo.img) {
        // borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    });
}

const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Coleccion no configurada'
            })
            break;
    }

    // limpiar imagenes previas 
    if (modelo.img) {
        // borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../public/img', 'technical_difficulties.jpg');
    res.sendFile(pathImagen);

}

const actualizarImagenCloudDinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe producto con id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Coleccion no configurada'
            })
            break;
    }

    // limpiar imagenes previas 
    if (modelo.img) {
        // borrar la imagen del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }
    const {tempFilePath} = req.files.archivo;
    const resp = await cloudinary.uploader.upload(tempFilePath, {crop: "scale", width: 300 });

    modelo.img = resp.secure_url;
    await modelo.save();

    res.json({
        modelo
    });
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudDinary
};
