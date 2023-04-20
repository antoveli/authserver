const mongose = require('mongoose');

const dbConnection = async() => {
    try{

        await mongose.connect(process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true           
        });

    }
    catch(error){
        console.log( 'Este error es ' + error);
        throw new Error('Error a al conectar a la BD');
    }

    console.log('bd conectada...')

}

module.exports = {
    dbConnection
}