// RUTAS DE tipo_persona

const router = require("express").Router(); // importar express.Router()

const tipo_personaController = require('../controllers/tipo_persona.controller') // importar el archivo de controladores de tipo_persona


router.post('/', tipo_personaController.crear)
router.get('/', tipo_personaController.listar)
router.put('/:id', tipo_personaController.update)


module.exports = router;