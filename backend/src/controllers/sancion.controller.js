// FUNCIONAMIENTO DE TODAS LAS RUTAS DE sancion

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const sancion = await models.sancion.findAll({
        model: models.sancion,
        attributes: ['id', 'tipo_sancion', 'descripcion', 'fecha_inicio', 'fecha_fin', 'estado'],
        include: [
          {
            model: models.persona, // Agregar modelo de usuarios
            attributes: ['id', 'nombre', 'correo', 'ci', 'celular', 'estado'],
          },
          {
            model: models.prestamo, // Agregar modelo de usuarios
            attributes: ['id', 'garantia', 'estado', 'fecha_prestamo', 'fecha_devolucion'],
            include: [
              {
                model: models.usuario, // Agregar modelo de usuarios
                attributes: ['id', 'nombre', 'estado'], // Especificar las columnas que se desean obtener
              },
              {
                model: models.documento,
                attributes: ['id', 'descripcion', 'titulo', 'estado']

              },
              {
                model: models.persona,
                attributes: ['id', 'nombre', 'correo', 'estado']

              },
            ],
          },


        ],
      });
      res.json({
        success: true,
        data: {
          sancion: sancion
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de sanciones"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { tipo_sancion, descripcion, fecha_inicio, fecha_fin, estado, personaId, prestamoId } = req.body;

      // Crear la sanción
      const sancion = await models.sancion.create({
        tipo_sancion,
        descripcion,
        fecha_inicio,
        fecha_fin,
        estado,
        personaId,
        prestamoId
      });

      // Desactivar persona siempre
      await models.persona.update(
        { estado: 0 },
        { where: { id: personaId } }
      );

      // Solo desactivar préstamo si existe prestamoId
      if (prestamoId) {
        await models.prestamo.update(
          { estado: 0 },
          { where: { id: prestamoId } }
        );
      }
      res.status(200).json({
        success: true,
        message: prestamoId
          ? 'Persona y préstamo sancionados correctamente.'
          : 'Persona sancionada correctamente (sin préstamo asociado).'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear la sanción'
      });
    }
  },


  // 

  update: async (req, res) => {
    const sancionId = req.params.id; // Suponiendo que el ID de la sancion a actualizar se pasa como parte de la URL.
    const { tipo_sancion, descripcion, fecha_inicio, fecha_fin, estado, personaId } = req.body;
    try {
      // Busca la sancion que se va a actualizar
      const sancion = await models.sancion.findByPk(sancionId);

      if (!sancion) {
        return res.json({
          success: false,
          data: {
            message: "sancion no encontrado"
          }
        });
      }

      // Actualiza los campos de la sancion
      sancion.tipo_sancion = tipo_sancion,
        sancion.descripcion = descripcion,
        sancion.fecha_inicio = fecha_inicio,
        sancion.fecha_fin = fecha_fin,
        sancion.estado = estado,
        sancion.personaId = personaId
      // Guarda los cambios en la base de datos
      await sancion.save();

      res.json({
        success: true,
        data: {
          sancion,

        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar la sancion"
        }
      });
    }
  },
}