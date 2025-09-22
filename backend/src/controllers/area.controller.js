// FUNCIONAMIENTO DE TODAS LAS RUTAS DE Area

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const area = await models.area.findAll({
        model: models.area,
        attributes: ['id', 'nombre', 'estado'],
      });
      res.json({
        success: true,
        data: {
          area: area
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de areas"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { nombre, estado } = req.body;

      const area = await models.area.create({
        nombre,
        estado,
      });

      res.status(201).json({
        success: true,
        data: area
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el area'
      });
    }
  },

  // 

  update: async (req, res) => {
    const areaId = req.params.id; // Suponiendo que el ID del area a actualizar se pasa como parte de la URL.
    const { nombre, estado} = req.body;
    try {
      // Busca el area que se va a actualizar
      const area = await models.area.findByPk(areaId);

      if (!area) {
        return res.json({
          success: false,
          data: {
            message: "area no encontrado"
          }
        });
      }

      // Actualiza los campos del area
      area.nombre = nombre;
      area.estado = estado;

      // Guarda los cambios en la base de datos
      await area.save();

      res.json({
        success: true,
        data: {
          area,
   
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar el area"
        }
      });
    }
  },
  eliminarArea: async (req, res) => {
    const areaId = req.params.id; // Suponiendo que el ID del área a eliminar se pasa como parte de la URL.
    
    try {
      // Busca el área que se va a eliminar
      const area = await models.area.findByPk(areaId);
  
      if (!area) {
        return res.json({
          success: false,
          data: {
            message: "Área no encontrado"
          }
        });
      }
  
      // Elimina el área de la base de datos
      await area.destroy();
  
      res.json({
        success: true,
        data: {
          message: "Área eliminada correctamente",
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al eliminar el área"
        }
      });
    }
  }

}