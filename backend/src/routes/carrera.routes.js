// RUTAS DE CARRERA

const router = require("express").Router(); // importar express.Router()

const carreraController = require('../controllers/carrera.controller') // importar el archivo de controladores de carrera


router.post('/', carreraController.crear)
router.get('/', carreraController.listar)
router.put('/:id', carreraController.update)


module.exports = router;