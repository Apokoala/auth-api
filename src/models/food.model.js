const { DataTypes } = require('sequelize')

function makeFood(sequelize) {
    return sequelize.define('Clothes', {
        name: DataTypes.STRING,
        group: DataTypes.STRING,
    })
}

module.exports = { makeFood }