const express = require('express')
const { sauceCollection } = require('../models/index')

const sauceRoutes = express();
sauceRoutes.get('/sauce', getSauces) // Retrieve All
sauceRoutes.get('/sauce/:id', getSauce) // Retrieve One
sauceRoutes.post('/sauce', createSauce) // Create
sauceRoutes.put('/sauce/:id', updateSauce) // Update
sauceRoutes.delete('/sauce/:id', deleteSauce) // Delete

const getSauces = async (_, res) => {
    const allSauce = await sauceCollection.read()
    res.json(allSauce)
}

const getSauce = async (req, res, next) => {
    const id = req.params.id
    const sauce = await sauceCollection.read(id)
    sauce === null ? next() : res.json(food)
}

const deleteSauce = async (req, res, next) => {
    const id = req.params.id
    const sauce = await sauceCollection.delete(id)
    if (sauce === null) {
        next()
    } else {
        await sauce.destroy();
        res.json({})
    }
}
const createSauce = async (req, res) => {
    const sauceItemName = req.body.name
    const sauceGroup = req.body.group
    const sauce = await sauceCollection.create({
        name: sauceItemName,
        group: sauceGroup,
    })
    res.json(sauce);
}


const updateSauce = async (req, res, next) => {
    const id = req.params.id
    let sauce;

    const sauceItemName = req.body.name ?? sauce.name
    const sauceGroup = req.body.group ?? user.group
    // console.log(req.body.group)
    let updatedSauce = {
        name: sauceItemName,
        group: sauceGroup,
    }

    sauce = await sauceCollection.update(updatedSauce, id)

    res.json(sauce)
}
sauceRoutes.get('/sauce', getSauces) // Retrieve All
sauceRoutes.get('/sauce/:id', getSauce) // Retrieve One
sauceRoutes.post('/sauce', createSauce) // Create
sauceRoutes.put('/sauce/:id', updateSauce) // Update
sauceRoutes.delete('/sauce/:id', deleteSauce) // Delete
module.exports = { sauceRoutes }