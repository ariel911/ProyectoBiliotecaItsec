// FUNCIONAMIENTO DE TODAS LAS RUTAS DE USUARIO

const models = require("../database/models/index");
const { Op } = require('sequelize');
module.exports = {

    listar: async (req, res) => {
        try {
          const autores = await models.autor.findAll({
            attributes: ['id','nombre','estado']
          });
          res.json({
            success: true,
            data: {
                autores: autores
            }
          });
        } catch (error) {
          console.error(error);
          res.json({
            success: false,
            data: {
              message: "Ha ocurrido un error al obtener la lista de autores"
            }
          });
        }
      },
      
    //     // Función para crear un nuevo autor
    crear: async (req, res) => {
        try {
            const autores = await models.autor.create(req.body);
            res.status(201).json({
              success: true,
              data: autores
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({
              success: false,
              error: 'Ha ocurrido un error al crear el autor'
            });
          }
        },

    update: async (req, res) => {
        try {
            const autores = await models.autor.findByPk(req.params.id);
    
            if (autores) {
                await autores.update(req.body);
    
                res.json({
                    success: true,
                    data: {
                        message: `El autor con id ${autores.id} ha sido actualizado exitosamente`
                    }
                });
            } else {
                res.json({
                    success: false,
                    data: {
                        message: 'El autor no existe'
                    }
                });
            }
        } catch (error) {
            console.error(error);
            res.json({
                success: false,
                data: {
                    message: 'Ha ocurrido un error al actualizar el autor'
                }
            });
        }
    },
    
    eliminar: async (req, res) => {
      try {
          const { id } = req.params; // Obtener el ID del autor de los parámetros de la solicitud
          const resultado = await models.autor.destroy({ where: { id } }); // Eliminar el autor con el ID especificado
          if (resultado === 0) { // Comprobar si no se ha eliminado ningún registro
              res.status(404).json({
                  success: false,
                  error: 'El autor no se encontró en la base de datos'
              });
          } else { // Si se eliminó el registro correctamente
              res.status(200).json({
                  success: true,
                  message: 'El autor ha sido eliminado correctamente'
              });
          }
      } catch (error) {
          console.error(error);
          res.status(500).json({
              success: false,
              error: 'Ha ocurrido un error al eliminar el autor'
          });
      }
  }
}