const {fetchArticleById, updateArticleVotes, getArticleVotes} = require("../models/articlesModel")

const getArticleById = (req, res, next) => {
    let commentCount = null
    if (req.queries) {
        
    }
    const {article_id : articleId} = req.params
    fetchArticleById(articleId).then((data) => {
        res.status(200).send({article: data})
    }).catch((err) => {
        next(err)
    })
}

const patchArticleById = (req, res, next) => {
    const {article_id : articleId} = req.params
    const {inc_votes: votes} = req.body
    updateArticleVotes(articleId, votes).then((data) => {
        res.status(200).send({article: data})
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getArticleById, patchArticleById}