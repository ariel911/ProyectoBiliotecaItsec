const models = require("../database/models/index");
const { Op } = require('sequelize');

module.exports = {

    listar: async (req, res) => {
        try {
          const devoluciones = await models.devolucion.findAll({
            attributes: ['id','titulo', 'nombrePersona','estadoLibro','fecha_devuelta'],
            include: [
                {
                  model: models.prestamo, // Agregar modelo de usuarios
                  attributes: ['id','observaciones','garantia'], 
                  include: [
                    {
                      model: models.documento,
                      attributes:['id','descripcion','titulo']
                      
                    },
                    {
                      model: models.persona,
                      attributes:['id','nombre','correo']
                      
                    },
                  ],// Especificar las columnas que se desean obtener
                },
                
              ],
          });
          res.json({
            success: true,
            data: {
                devolucion: devoluciones
            }
          });
        } catch (error) {
          console.error(error);
          res.json({
            success: false,
            data: {
              message: "Ha ocurrido un error al obtener la lista de devoluciones"
            }
          });
        }
      },
      crear: async (req, res) => {
        try {
            const devoluciones = await models.devolucion.create(req.body);
            res.status(201).json({
              success: true,
              data: devoluciones
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({
              success: false,
              error: 'Ha ocurrido un error al crear la devolucion'
            });
          }
        },
    }