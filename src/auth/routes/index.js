const express = require('express')
const base64 = require('js-base64')
const { User } = require('../models')
const jwt = require('jsonwebtoken')

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'SET A TOKEN SECRET'

const authRoutes = express.Router()

const signup = async (req, res) => {
    const { username, password, role } = req.body
    await User.createWithHashed(username, password, role)
    res.status(201).send()
}

const signin = async (req, res, next) => {
    const authorization = req.header('Authorization')
    if (!authorization || !authorization.startsWith('Basic ')) {
        return next(new Error('Invalid authorization scheme'))
    }

    const decoded = base64.decode(authorization.replace('Basic ', ''))

    const [username, password] = decoded.split(':')
    try {
        const user = await User.findLoggedIn(username, password)
        if (!user) {
            return next(new Error('Invalid login'))
        }
        const token = jwt.sign({ username: user.username, role: user.role }, TOKEN_SECRET)
        res.send(token)
    } catch (e) {
        return next(e)
    }
}

const checkToken = async (req, res, next) => {
    const authorization = req.header('Authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(new Error('Missing required Bearer header'))
    }

    const token = authorization.replace('Bearer ', '')
    try {
        const decoded = jwt.verify(token, TOKEN_SECRET)
        req.username = decoded.username
        req.role = decoded.role
        next()
    } catch (e) {
        return next(new Error('Failed to decode authorization', { cause: e }))
    }
}

const ensureRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.role)) {
        return next(new Error('Insufficient permissions'))
    }
    next()
}

authRoutes.use(express.json())
authRoutes.post('/signup', signup)
authRoutes.post('/signin', signin)

module.exports = { checkToken, ensureRole, signup, signin }
