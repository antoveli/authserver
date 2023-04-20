const express = require('express');
const cors = require('cors');
const {dbConnection} = require('./db/config')
require('dotenv').config();


//Crera el servidor/aplicacion de express
const app = express();

//Base de datos
dbConnection();

//directorio publico
app.use(express.static('public'));

//Cors
app.use(cors() );

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.PORT, ()=>{
    console.log(`Server corriendo en puerto ${process.env.PORT}` );
});