'use strict' // para que no se pueda usar variables no definidas

module.exports = (sequelize, DataTypes) => {

  let Usuario = sequelize.define('usuario', { // defino el modelo de la tabla persona
    id: {
      type: DataTypes.BIGINT, // tipo de dato
      autoIncrement: true, // autoincrementable
      primaryKey: true, // clave primaria 
      allowNull: false // no permitir nulo
    },
    nombre: { // nombre de la columna
      type: DataTypes.STRING, // tipo de dato
      allowNull: false 
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    estado:{
      type:DataTypes.INTEGER,
    },
    createdAt: { // fecha de creacion
      type: DataTypes.DATE, // tipo de dato
      field: 'created_at', // nombre de la columna
      defaultValue: DataTypes.NOW, // valor por defecto
      allowNull: false // no puede ser nulo
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    deletedAt: { // fecha de eliminacion
      type: DataTypes.DATE, // tipo de dato
      field: 'deleted_at' // nombre de la columna
    }
  }, {
    paranoid: true, // elimina los registros de forma logica
    freezeTableName: true, // no va a modificar el nombre de la tabla a plural
  })

  Usuario.associate = models => {
    // aca se relacionan las tablas de la base de datos 
    Usuario.hasMany(models.prestamo)
    Usuario.belongsTo(models.rol)

  }

  return Usuario
}