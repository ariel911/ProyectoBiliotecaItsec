'use strict' 

module.exports = (sequelize, DataTypes) => {

  let Tipo_Persona = sequelize.define('tipo_persona', { 
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
    estado:{
        type:DataTypes.INTEGER,
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

  Tipo_Persona.associate = models => {
    Tipo_Persona.hasMany(models.persona)
  }

  return Tipo_Persona
}