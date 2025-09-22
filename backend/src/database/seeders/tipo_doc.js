'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.tipo_doc.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre: 'Proyecto de grado',
          estado: 1, // Activo
        }
      }),
      models.tipo_doc.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre: 'Tesis',
          estado: 1, // Activo
        }
      }),
      models.tipo_doc.findOrCreate({
        where: { id: 3 },
        defaults: {
          nombre: 'Libro',
          estado: 1, // Activo
        }
      }),

  

    ]);
  },
};
