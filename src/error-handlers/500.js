const ise = (err, req, res, next) => {
    res.status(500).send({ message: 'there was a problem' })
}

module.exports = ise