const { response } = require('express');
const  Usuario  = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, name, password } = req.body;

    try {
        //Verificar si no existe un correo igual
       
        const usuario = await Usuario.findOne({ email: email });

        if (usuario>0) {
            return res.status(400).json({
                msg: 'Ya existe un usuario con ese email'
            });
        }
        

        //Crear usuario con el modelo
        const dbUser = new Usuario(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);
        console.log( 'Este es el pasword hasheado '+ dbUser.password);

        //Genera JWT para autenticacion
        const token = await generarJWT(dbUser.uid, name);
        //console.log('El token es: ' + token);

        //Crear usuario en BD
        await dbUser.save();

        //Generar respuesta exitos
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        });
    }


}

const loginUsuario = async (req, res = respose) => {

    const { email, password } = req.body;
    
    try {
        
        const dbUser = await Usuario.findOne({email});

        if(!dbUser){
            return res.status(400).json({
                ok:false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar el password
        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        //Generar el Token de logguin

        const token = await generarJWT(dbUser.uid, dbUser.name);

        //respuesta del servicio
        return res.json({
            ok:true,
            uid: dbUser.uid,
            name: dbUser.name,
            token
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
        
    }
}

const   revalidarToken = async (req, res = response) => {

    const {uid, name} = req;

    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token
        
    });
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}