const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

const emailExiste = async(correo='') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail) {
        throw new Error(`El correo :  ${correo} ya esta registrado en la BD`);
    }

}

const existeUsuarioPorId = async(id='') => {
    const existeUsuarios = await Usuario.findById(id);
    if (!existeUsuarios) {
        throw new Error(`El id :  ${id} NO existe.`);
    }

}

const existeCategoria = async(id='') => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id :  ${id} NO existe.`);
    }
    if (existeCategoria.estado === false) {
        throw new Error(`Esa categoria fue eliminada de la base de datos.`);
    }

}

const existeProducto = async(id = '') => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id :  ${id} NO existe.`);
    }
    if (existeProducto.estado === false) {
        throw new Error(`Ese Producto fue eliminado de la base de datos.`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}