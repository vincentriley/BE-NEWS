const fetchTopics = require("../models/topicsModel")

const getTopics = (req, res, next) => {
    fetchTopics().then((data) => {
        console.log(data)
        res.status(200).send({topics: data})
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getTopics}