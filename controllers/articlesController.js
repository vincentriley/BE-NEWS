const {fetchArticleById, updateArticleVotes, getArticleVotes} = require("../models/articlesModel")

const getArticleById = (req, res, next) => {
    let commentCount = false
    if (req.query.comment_count && req.query.comment_count !== "true" && req.query.comment_count !== "false") {
        next({
            status: 400,
		 	msg: "Invalid query parameter"
        })
    }
    if (req.query.comment_count === "true") {
        commentCount = true
    }
    const {article_id : articleId} = req.params
    fetchArticleById(articleId, commentCount).then((data) => {
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