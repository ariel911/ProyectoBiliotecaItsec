'use strict' 

module.exports = (sequelize, DataTypes) => {

  let Rol= sequelize.define('rol', { 
    id: {
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true,  
      allowNull: false 
    },
    nombre_rol: { 
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

  Rol.associate = models => {
    Rol.hasMany(models.usuario)
    Rol.hasMany(models.menu_rol)
  }

  return Rol
}