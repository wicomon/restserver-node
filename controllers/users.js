const { response, request } = require("express"); //redundante para q vscode reconozca los tags


const usuariosGet = (req = request, res = response) => {
    const { q, nombre = 'no name', apikey, page = 1, limit = 10 } = req.query;
    res.json({
        msg: "Get api - controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const usuariosPost = (req, res = response) => {
    const id = req.params.id;

    const body = req.body;

    res.json({
        msg: "POST api - controlador",
        body,
        id,
    });
};

const usuariosPut = (req, res = response) => {
    res.json({
        msg: "PUT api - controlador",
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "PATCH api - controlador",
    });
};

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: "DELETE api - controlador",
    });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
