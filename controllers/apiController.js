const endPoints = require("../endpoints.json")

const getApi = (req, res, next) => {
    res.status(200).send(endPoints)
}

module.exports = getApi