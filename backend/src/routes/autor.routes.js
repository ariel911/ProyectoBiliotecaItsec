// RUTAS DE USUARIOS

const router = require("express").Router(); // importar express.Router()

const autoresController = require('../controllers/autor.controller') // importar el archivo de controladores de usuarios


router.get('/', autoresController.listar)
router.post('/', autoresController.crear)
router.put('/:id', autoresController.update)
router.put('/:id', autoresController.eliminar)




module.exports = router;