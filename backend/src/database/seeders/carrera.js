'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.carrera.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre: 'Sistemas Informaticos',
          estado: 1, // Activo
        }
      }),
      models.carrera.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre: 'Mercadotecnia',
          estado: 1, // Activo
        }
      }),
      models.carrera.findOrCreate({
        where: { id: 3 },
        defaults: {
          nombre: 'Contaduría General',
          estado: 1, // Activo
        }
      }),
        models.carrera.findOrCreate({
        where: { id: 4 },
        defaults: {
          nombre: 'Turismo',
          estado: 1, // Activo
        }
      }),
        models.carrera.findOrCreate({
        where: { id: 5 },
        defaults: {
          nombre: 'Secretariado Ejecutivo',
          estado: 1, // Activo
        }
      }),

  

    ]);
  },
};
