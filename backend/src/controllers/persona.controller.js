// FUNCIONAMIENTO DE TODAS LAS RUTAS DE persona

const models = require("../database/models/index");
const { Op } = require('sequelize');
const { encrypt } = require('../helpers/handleBcrypt')
module.exports = {

  listar: async (req, res) => {
    try {
      const personas = await models.persona.findAll({
        model: models.persona,
        attributes: ['id', 'nombre','clave', 'correo', 'ci', 'celular', 'estado'],
        include: [{
          model: models.persona_carrera,
          include: [{
            model: models.carrera,
            attributes: ['id', 'nombre', 'estado'],
          }]
        },
        {
          model: models.tipo_persona,
          attributes: ['id', 'nombre', 'estado'],

        }
        ]
        ,
      });
      res.json({
        success: true,
        data: {
          personas: personas
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de personas"
        }
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, correo, ci, celular, estado, tipoPersonaId,clave,usuarioId} = req.body;

      const persona = await models.persona.create({
        nombre,
        correo,
        ci,
        usuarioId,
        clave,
        celular,
        estado,
        // Asocia el persona con un carrera
        tipoPersonaId,
      });
      if (req.body.carreras && Array.isArray(req.body.carreras)) {
        for (const carreraId of req.body.carreras) {

          await models.persona_carrera.create({
            personaId: persona.id,
            carreraId: carreraId
          });
        }
      }
      res.status(201).json({
        success: true,
        data: persona
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear la persona'
      });
    }
  },

  // 
  update: async (req, res) => {
    const userId = req.params.id; // Suponiendo que el ID del persona a actualizar se pasa como parte de la URL.
    const { nombre, correo, ci, celular, estado, carreraId } = req.body;

    try {
      // Busca el persona que se va a actualizar
      const persona = await models.persona.findByPk(userId);

      if (!persona) {
        return res.json({
          success: false,
          data: {
            message: "persona no encontrado"
          }
        });
      }

      // Actualiza los campos del persona
      persona.nombre = nombre;
      persona.correo = correo;
      persona.ci = ci;
      persona.celular = celular;
      persona.estado = estado;
      persona.carreraId = carreraId; // Actualiza la relación con carrera

      // Guarda los cambios en la base de datos
      await persona.save();

      res.json({
        success: true,
        data: {
          persona,
          // Si también deseas enviar información sobre los préstamos actualizados, puedes hacerlo aquí.
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al actualizar el persona"
        }
      });
    }
  },

  sancionar: async (req, res) => {
    try {
      const persona = await models.persona.findByPk(req.params.id);


      if (persona) {
        await persona.update(req.body);
      }

      res.json({
        success: true,
        data: {
          message: `El persona con id ${persona.id} ha sido actualizado exitosamente`
        }
      });

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el persona'
        }
      });
    }
  },
  darBaja: async (req, res) => {
    try {
      const persona = await models.persona.findByPk(req.params.id);


      if (persona) {
        await persona.update(req.body);
      }

      res.json({
        success: true,
        data: {
          message: `El persona con id ${persona.id} ha sido actualizado exitosamente`
        }
      });

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el persona'
        }
      });
    }
  },


}