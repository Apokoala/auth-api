const { DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

const COMPLEXITY = parseInt(process.env.COMPLEXITY) || 8

function makeAuthUser(sequelize) {
    const AuthUser = sequelize.define('Auth', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
    })

    AuthUser.createWithHashed = async (username, password, role) => {
        try {
            const hashedPassword = await bcrypt.hash(password, COMPLEXITY)
            return await AuthUser.create({ username, password: hashedPassword, role })
        } catch (e) {
            console.error(`Error creating user: ${e}`)
            return null
        }
    }

    AuthUser.findLoggedIn = async (username, password) => {
        try {
            const user = await AuthUser.findOne({ where: { username } })
            if (!user) {
                return null
            }
            const matches = await bcrypt.compare(password, user.password)
            return matches ? user : null
        } catch (e) {
            console.error(`Error finding logged in user: ${e}`)
            return null
        }
    }

    return AuthUser
}

module.exports = { makeAuthUser }