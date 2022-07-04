const fetchTopics = require("../models/topicsModel")

const getTopics = (req, res, next) => {
    fetchTopics().then((data) => {
        res.status(200).send({topics: data})
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getTopics}