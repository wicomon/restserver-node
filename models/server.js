const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.rutas = {
            usuariosPath : '/api/user',
            authPath : '/api/auth',
            categoriasPath : '/api/categorias',
            productosPath : '/api/productos',
            buscarPath : '/api/buscar'
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares (funciones que se ejecuta cuando se levante el servidor)
        this.middlewares();
        
        // Rutas de la aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use( express.json() );

        //directorio publico
        this.app.use(express.static('public'));
        
    }

    routes(){
        this.app.use(this.rutas.authPath, require('../routes/auth'));
        this.app.use(this.rutas.usuariosPath, require('../routes/user'));
        this.app.use(this.rutas.categoriasPath, require('../routes/categorias'));
        this.app.use(this.rutas.productosPath, require('../routes/productos'));
        this.app.use(this.rutas.buscarPath, require('../routes/buscar'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('servidor corriendo en el puerto : ', this.port);
        });
    }


}

module.exports = Server;