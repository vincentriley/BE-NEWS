const {fetchArticleById} = require("../models/articlesModel")

const getArticleById = (req, res, next) => {
    fetchArticleById().then((data) => {
        res.status(200).send({topics: data})
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getArticleById}