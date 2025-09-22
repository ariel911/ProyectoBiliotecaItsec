// FUNCIONAMIENTO DE TODAS LAS RUTAS DE CARRERA

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const carrera = await models.carrera.findAll({
        model: models.carrera,
        attributes: ['id', 'nombre', 'estado'],
      });
      res.json({
        success: true,
        data: {
          carrera: carrera
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de carreras"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { nombre, estado } = req.body;

      const carrera = await models.carrera.create({
        nombre,
        estado,
      });

      res.status(201).json({
        success: true,
        data: carrera
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el carrera'
      });
    }
  },

  // 

  update: async (req, res) => {
    const carreraId = req.params.id; // Suponiendo que el ID de la carrera a actualizar se pasa como parte de la URL.
    const { nombre, estado} = req.body;
    try {
      // Busca el carrera que se va a actualizar
      const carrera = await models.carrera.findByPk(carreraId);

      if (!carrera) {
        return res.json({
          success: false,
          data: {
            message: "carrera no encontrado"
          }
        });
      }

      // Actualiza los campos de la carrera
      carrera.nombre = nombre;
      carrera.estado = estado;

      // Guarda los cambios en la base de datos
      await carrera.save();

      res.json({
        success: true,
        data: {
          carrera,
   
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar la carrera"
        }
      });
    }
  },
}