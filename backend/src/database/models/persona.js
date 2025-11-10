'use strict'

module.exports = (sequelize, DataTypes) => {

  let Persona = sequelize.define('persona', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ci: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    celular: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    paranoid: true,
    freezeTableName: true,
  })

  Persona.associate = models => {
    Persona.hasMany(models.reserva)
    Persona.hasMany(models.prestamo)
    Persona.hasMany(models.sancion)
    Persona.hasMany(models.persona_carrera)
    Persona.belongsTo(models.tipo_persona)
    Persona.belongsTo(models.usuario)
  }

  return Persona
}