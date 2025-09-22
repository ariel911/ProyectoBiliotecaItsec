// FUNCIONAMIENTO DE TODAS LAS RUTAS DE tipo_persona

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const tipo_persona = await models.tipo_persona.findAll({
        model: models.tipo_persona,
        attributes: ['id', 'nombre', 'estado'],
      });
      res.json({
        success: true,
        data: {
          tipo_persona: tipo_persona
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

      const tipo_persona = await models.tipo_persona.create({
        nombre,
        estado,
      });

      res.status(201).json({
        success: true,
        data: tipo_persona
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
    const tipo_personaId = req.params.id; // Suponiendo que el ID del tipo_persona a actualizar se pasa como parte de la URL.
    const { nombre, estado} = req.body;
    try {
      // Busca el tipo_persona que se va a actualizar
      const tipo_persona = await models.tipo_persona.findByPk(tipo_personaId);

      if (!tipo_persona) {
        return res.json({
          success: false,
          data: {
            message: "tipo de documento no encontrado"
          }
        });
      }

      // Actualiza los campos del tipo_persona
      tipo_persona.nombre = nombre;
      tipo_persona.estado = estado;

      // Guarda los cambios en la base de datos
      await tipo_persona.save();

      res.json({
        success: true,
        data: {
          tipo_persona,
   
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