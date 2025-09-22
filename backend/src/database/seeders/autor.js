'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.autor.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre: 'Jhon Pradelaz',
          estado: 1, // Activo
        }
      }),
      models.autor.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre: 'Oscar Ortiz',
          estado: 1, // Activo
        }
      }),
      models.autor.findOrCreate({
        where: { id: 3 },
        defaults: {
          nombre: 'Maria Ramos',
          estado: 1, // Activo
        }
      }),

  

    ]);
  },
};
