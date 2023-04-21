const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    const token = req.headers['x-token'];

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        })
    }

    try {

        const { id, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        
        req.uid = id;
        req.name = name;
        

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no Válido'
        });
    }

    //Todo ok
    next()
}


module.exports = {
    validarJWT
}