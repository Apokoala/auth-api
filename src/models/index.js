const { Sequelize } = require('sequelize')
const { makeFood } = require('./user.model')
const { makeClothes } = require('./clothes.model')
const Collection = require('./class-collection')
const { makeSauce } = require('./sauce')


const DATABASE_URL =
    process.env.NODE_ENV === 'test'
        ? 'sqlite::memory:'
        : process.env.DATABASE_URL

const CONNECTION_OPTIONS =
    process.env.NODE_ENV === 'test'
        ? {}
        : {
              ssl: {
                  require: true,
                  rejectUnauthorized: false,
              },
          }

const sequelize = new Sequelize(DATABASE_URL, CONNECTION_OPTIONS)

const Food = makeFood(sequelize);
const Clothes = makeClothes(sequelize);
const Sauce = makeSauce(sequelize);

Food.hasMany(Sauce);

module.exports = {
    sequelize,
    foodCollection: new Collection(Food),
    clothesCollection: new Collection(Clothes),
    sauceCollection: new Collection(Sauce)
}