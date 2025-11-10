const models = require("../database/models/index")

const bcrypt = require('bcryptjs') // para encriptar la contraseña

const signJWT = require('../middlewares/signJWT') // para crear el token
const {encrypt}=require('../helpers/handleBcrypt')

module.exports = {

    login: async (req, res, next) => {
        try {
            // 1. Verifico que el usuario exista solo comparando con el email
            const user = await models.usuario.findOne({

                    include:[{
                      model:models.rol,
                      attributes:['id','nombre_rol']
                    }],
                  
                
                where: {
                    user_name: req.body.user_name
                }
            })
            var contraseniaCoincide = false
            if (user) {  // Si existe el usuario
                // 2. Verifico que la contraseña sea correcta
                contraseniaCoincide = await bcrypt.compareSync(req.body.clave, user.clave) 
                // Comparo la contraseña ingresada con la contraseña de la base de datos
            }
            if (!user || !contraseniaCoincide) {
                return res.status(500).json({
                    success: false,
                    error: 'usuario o contraseña incorrecta'
                  });
            }


            // 3. Si todo está bien, devuelvo el token
            res.json({
                success: true,
                data: {
                    token: signJWT(user), // Creo el token con los datos del usuario
                    usuario:user
                }
            })
        } catch (err) {
            return next(err)
        }
    },
    acces: async (req, res, next) => {
        try {
            // 1. Verifico que el usuario exista solo comparando con el email
            const user = await models.usuario.findOne({
                where: {
                    user_ame: req.body.user_name
                }
            })
            var contraseniaCoincide = false
            if (user) {  // Si existe el usuario
                // 2. Verifico que la contraseña sea correcta
                contraseniaCoincide = await bcrypt.compareSync(req.body.clave, user.clave) 
                // Comparo la contraseña ingresada con la contraseña de la base de datos
            }
            if (!user || !contraseniaCoincide) {
                return res.status(500).json({
                    success: false,
                    error: 'usuario o contraseña incorrecta'
                  });
            }
            res.json({
                success: true,
                data: {
                    id: user.id,
                    nombre: user.nombre,

                    user_name: user.user_name,
                }
            })

        } catch (err) {
            return next(err)
        }
    },
    registrarse: async (req, res, next) => {
     
            
            const claveHash= await encrypt(req.body.clave)
            const registerUser= await models.usuario.create({
                correo:req.body.correo,
                apellido:req.body.apellido,
                nombre:req.body.nombre,
                clave:claveHash,
                ci:req.body.ci,
                telefono:req.body.telefono,
                direccion:req.body.direccion,
                fecha_registro:req.body.fecha_registro,
                
            })
            const relacion = await models.usuario_roles.create({
                usuarioId: registerUser.id,
                rolId: req.body.rolId
                
              })
            
            res.send({data:registerUser})

        
    }

}