// RUTAS PARA AUTENTICAR

const router = require("express").Router()
const authController = require('../controllers/auth.controller')
/* const validate = require('../middlewares/validate')
const authScheme = require('../middlewares/schemas/auth.scheme') */
//

router.post('/login',authController.login)
//router.post('/acces',authController.acces)
//router.post('/registrarse', authController.registrarse)


module.exports = router