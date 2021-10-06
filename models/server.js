const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../database/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.rutas = {
            usuarios : '/api/user',
            auth : '/api/auth',
            categorias : '/api/categorias',
            productos : '/api/productos',
            buscar : '/api/buscar',
            upload: '/api/uploads'
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

        //FILEUPLOAD - carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes(){
        this.app.use(this.rutas.auth, require('../routes/auth'));
        this.app.use(this.rutas.usuarios, require('../routes/user'));
        this.app.use(this.rutas.categorias, require('../routes/categorias'));
        this.app.use(this.rutas.productos, require('../routes/productos'));
        this.app.use(this.rutas.buscar, require('../routes/buscar'));
        this.app.use(this.rutas.upload, require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('servidor corriendo en el puerto : ', this.port);
        });
    }


}

module.exports = Server;