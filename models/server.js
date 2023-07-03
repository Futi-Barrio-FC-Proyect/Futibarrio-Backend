//Configuración del server
//Importaciones básicas
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const { defaultRoleAdminApp, defaultRoleAdminCampo, defaultRoleJugador, defaultRoleArbitro, defaultRoleUsuario } = require('../controllers/role');
const { defaultAdminApp } = require('../controllers/usuario');

class Server {

    constructor() {
        //Variables de configuración
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuarios',
            jugador: '/api/jugador',
            equipo: '/api/equipo',
            liga: '/api/liga',
            partido: '/api/partido',
            comentario:'/api/comentario',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

        defaultRoleAdminApp();
        defaultRoleAdminCampo();
        defaultRoleJugador();
        defaultRoleArbitro();
        defaultRoleUsuario();
        defaultAdminApp();

    }


    //Metodo de conección a Mongo
    async conectarDB() {
        await dbConection();
    }


    middlewares() {

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico del proyecto
        this.app.use(express.static('public'));

    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuario, require('../routes/usuario'));
        this.app.use(this.paths.jugador, require('../routes/jugadores'));
        this.app.use(this.paths.equipo, require('../routes/equipo'));
        this.app.use(this.paths.liga, require('../routes/liga'));
        this.app.use(this.paths.partido, require('../routes/partidos'));
        this.app.use(this.paths.comentario, require('../routes/comentarios'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }


}



module.exports = Server;