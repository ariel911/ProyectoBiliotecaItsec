'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.formato.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre: 'Fisico',
          estado: 1, // Activo
        }
      }),
      models.formato.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre: 'Digital',
          estado: 1, // Activo
        }
      }),
      models.formato.findOrCreate({
        where: { id: 3 },
        defaults: {
          nombre: 'Fisico y Digital',
          estado: 1, // Activo
        }
      }),

  

    ]);
  },
};
