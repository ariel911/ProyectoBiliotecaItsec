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
    user_name: {
      type: DataTypes.STRING, // tipo de dato
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ci: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.INTEGER,
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
    Usuario.hasMany(models.documento)
    Usuario.belongsTo(models.rol)
    Usuario.hasMany(models.persona)
    Usuario.hasMany(models.devolucion)
    Usuario.hasMany(models.sancion)
    Usuario.hasMany(models.sancion_historial)
  }

  return Usuario
}