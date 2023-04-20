const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    console.log('Entrando a validar token');
    const token = req.headers['x-token'];

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'Error en el token'
        })
    }

    try {

        const { uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        console.log('despuest del verify token en el try');
        req.uId = uid;
        req.name = name;
        console.log(req.uId);

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no Válido'
        });
    }

    //Todo ok
    next
}


module.exports = {
    validarJWT
}