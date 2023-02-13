const { DataTypes } = require('sequelize');

function makeSauce(sequelize) {
  return sequelize.define('Sauce', {
    name: DataTypes.STRING,
  });
}

module.exports = { makeSauce };