'use strict'

module.exports = (sequelize, DataTypes) => {

    let Menu = sequelize.define('menu', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        nombre_menu: {
            type: DataTypes.STRING,
            allowNull: false
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

    Menu.associate = models => {
        Menu.hasMany(models.menu_rol)
        
    }

    return Menu
}