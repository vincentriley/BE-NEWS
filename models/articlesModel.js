const db = require("../db/connection.js");

const fetchArticleById = () => {
    return db.query("")
    .then(({rows}) => {
        return rows
    })
}

module.exports = {fetchArticleById}