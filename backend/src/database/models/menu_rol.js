'use strict'

module.exports = (sequelize, DataTypes) => {

    let Menu_rol = sequelize.define('menu_rol', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
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

    Menu_rol.associate = models => {
        Menu_rol.belongsTo(models.rol)  
        Menu_rol.belongsTo(models.menu) 
    }

    return Menu_rol
}