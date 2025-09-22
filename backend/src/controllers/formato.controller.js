// FUNCIONAMIENTO DE TODAS LAS RUTAS DE formato

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const formato = await models.formato.findAll({
        model: models.formato,
        attributes: ['id', 'nombre', 'estado'],
      });
      res.json({
        success: true,
        data: {
          formato: formato
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de formatos"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { nombre, estado } = req.body;

      const formato = await models.formato.create({
        nombre,
        estado,
      });

      res.status(201).json({
        success: true,
        data: formato
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el formato'
      });
    }
  },

  // 

  update: async (req, res) => {
    const formatoId = req.params.id; // Suponiendo que el ID del formato a actualizar se pasa como parte de la URL.
    const { nombre, estado} = req.body;
    try {
      // Busca el formato que se va a actualizar
      const formato = await models.formato.findByPk(formatoId);

      if (!formato) {
        return res.json({
          success: false,
          data: {
            message: "formato no encontrado"
          }
        });
      }

      // Actualiza los campos del formato
      formato.nombre = nombre;
      formato.estado = estado;

      // Guarda los cambios en la base de datos
      await formato.save();

      res.json({
        success: true,
        data: {
          formato,
   
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar el formato"
        }
      });
    }
  },
  eliminarformato: async (req, res) => {
    const formatoId = req.params.id; // Suponiendo que el ID del formato a eliminar se pasa como parte de la URL.
    
    try {
      // Busca el formato que se va a eliminar
      const formato = await models.formato.findByPk(formatoId);
  
      if (!formato) {
        return res.json({
          success: false,
          data: {
            message: "Formatono encontrado"
          }
        });
      }
  
      // Elimina el formato de la base de datos
      await formato.destroy();
  
      res.json({
        success: true,
        data: {
          message: "formato eliminada correctamente",
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al eliminar el formato"
        }
      });
    }
  }

}