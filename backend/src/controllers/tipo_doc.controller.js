// FUNCIONAMIENTO DE TODAS LAS RUTAS DE TIPO_DOC

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const tipo_doc = await models.tipo_doc.findAll({
        model: models.tipo_doc,
        attributes: ['id', 'nombre', 'estado'],
      });
      res.json({
        success: true,
        data: {
          tipo_doc: tipo_doc
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de tipo de documento"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { nombre, estado } = req.body;

      const tipo_doc = await models.tipo_doc.create({
        nombre,
        estado,
      });

      res.status(201).json({
        success: true,
        data: tipo_doc
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el tipo de documento'
      });
    }
  },

  // 

  update: async (req, res) => {
    const tipo_docId = req.params.id; // Suponiendo que el ID del tipo_doc a actualizar se pasa como parte de la URL.
    const { nombre, estado} = req.body;
    try {
      // Busca el tipo_doc que se va a actualizar
      const tipo_doc = await models.tipo_doc.findByPk(tipo_docId);

      if (!tipo_doc) {
        return res.json({
          success: false,
          data: {
            message: "tipo de documento no encontrado"
          }
        });
      }

      // Actualiza los campos del tipo_doc
      tipo_doc.nombre = nombre;
      tipo_doc.estado = estado;

      // Guarda los cambios en la base de datos
      await tipo_doc.save();

      res.json({
        success: true,
        data: {
          tipo_doc,
   
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar el tipo de documento"
        }
      });
    }
  },
}