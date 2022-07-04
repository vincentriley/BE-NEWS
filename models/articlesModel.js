const db = require("../db/connection.js");

const fetchArticleById = (articleId) => {
    return db.query("SELECT * FROM ARTICLES WHERE article_id = $1", [articleId])
    .then(({rows}) => {
        const article = rows[0]
        if (!article) {
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id ${articleId}`
            })
        }
        return article
    })
}

const updateArticleVotes = (articleId) => {
    return db.query("", [articleId])
    .then(({rows}) => {
        const article = rows[0]
        if (!article) {
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id ${articleId}`
            })
        }
        return article
    })
}

module.exports = {fetchArticleById, updateArticleVotes}