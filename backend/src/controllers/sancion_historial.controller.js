// FUNCIONAMIENTO DE TODAS LAS RUTAS DE sancion_historial

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const sancion_historial = await models.sancion_historial.findAll({
        model: models.sancion_historial,
        attributes: ['id', 'motivo_levantamiento', 'fecha_levantamiento','estado'],
      });
      res.json({
        success: true,
        data: {
          sancion_historial: sancion_historial
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener el historial"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { motivo_levantamiento, fecha_levantamiento,estado } = req.body;

      const sancion_historial = await models.sancion_historial.create({
        motivo_levantamiento,
        fecha_levantamiento,
        estado,
      });

      res.status(201).json({
        success: true,
        data: sancion_historial
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear la sancion_historial'
      });
    }
  },

  // 

  update: async (req, res) => {
    const sancion_historialId = req.params.id; // Suponiendo que el ID de la sancion_historial a actualizar se pasa como parte de la URL.
    const { motivo_levantamiento, fecha_levantamiento,estado} = req.body;
    try {
      // Busca la sancion_historial que se va a actualizar
      const sancion_historial = await models.sancion_historial.findByPk(sancion_historialId);

      if (!sancion_historial) {
        return res.json({
          success: false,
          data: {
            message: "sancion no encontrado"
          }
        });
      }
      
      // Actualiza los campos de la sancion_historial
      sancion_historial.motivo_levantamiento = motivo_levantamiento,
      sancion_historial.fecha_levantamiento = fecha_levantamiento,
      sancion_historial.estado = estado
      // Guarda los cambios en la base de datos
      await sancion_historial.save();

      res.json({
        success: true,
        data: {
          sancion_historial,
   
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar el historial"
        }
      });
    }
  },
}