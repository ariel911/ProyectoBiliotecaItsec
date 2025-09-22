'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.menu.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre_menu: 'Todo',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre_menu: 'Usuarios',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 3 },
        defaults: {
          nombre_menu: 'Cargos',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 4 },
        defaults: {
          nombre_menu: 'Documentos Academicos',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 5 },
        defaults: {
          nombre_menu: 'Libros',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 6 },
        defaults: {
          nombre_menu: 'Formatos',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 7 },
        defaults: {
          nombre_menu: 'Tipo Documentos',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 8 },
        defaults: {
          nombre_menu: 'Areas',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 9 },
        defaults: {
          nombre_menu: 'Autores',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 10 },
        defaults: {
          nombre_menu: 'Miembros Instituto',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 11 },
        defaults: {
          nombre_menu: 'Carreras',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 12 },
        defaults: {
          nombre_menu: 'Sancionados',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 13 },
        defaults: {
          nombre_menu: 'Reportes',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 14 },
        defaults: {
          nombre_menu: 'Estadisticas',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 15 },
        defaults: {
          nombre_menu: 'Prestamos',
          estado: 1, // Activo
        }
      }),
      models.menu.findOrCreate({
        where: { id: 16 },
        defaults: {
          nombre_menu: 'Reservas',
          estado: 1, // Activo
        }
      }),
    ]);
  },
};
