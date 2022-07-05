const {fetchArticles, fetchArticleById, updateArticleVotes, addComment} = require("../models/articlesModel")

const getArticles = (req, res, next) => {
    fetchArticles().then((data) => {
        res.status(200).send({articles: data})
    }).catch((err) => {
        next(err)
    })
}

const getArticleById = (req, res, next) => {
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

const postComment = (req, res, next) => {
    const {article_id : articleId} = req.params
    const {username, body} = req.body
    console.log(ar)
    fetchArticleById(articleId).then((data) => {
        addComment(articleId, username, body).then((data) => {
            res.status(201).send({comment: data})
        }).catch((err) => {
            err.msg = "Invalid username"
            next(err)
        })
    }).catch((err) => {
        console.log(err, "fetchArticleError")
        err.msg = "Article not found"
        next(err)
    })
}

module.exports = {getArticles, getArticleById, patchArticleById, postComment}