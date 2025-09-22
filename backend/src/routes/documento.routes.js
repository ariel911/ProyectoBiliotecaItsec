// RUTAS DE USUARIOS

const router = require("express").Router(); // importar express.Router()

const documentoController = require('../controllers/documento.controller') // importar el archivo de controladores de usuarios


router.get('/', documentoController.listar)
router.post('/', documentoController.crear)
router.put('/:id', documentoController.update)
router.delete('/:id', documentoController.eliminar)
router.put('/baja/:id', documentoController.darBaja)



module.exports = router;