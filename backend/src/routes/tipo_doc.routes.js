// RUTAS DE TIPO_DOC

const router = require("express").Router(); // importar express.Router()

const tipo_docController = require('../controllers/tipo_doc.controller') // importar el archivo de controladores de tipo_doc


router.post('/', tipo_docController.crear)
router.get('/', tipo_docController.listar)
router.put('/:id', tipo_docController.update)


module.exports = router;