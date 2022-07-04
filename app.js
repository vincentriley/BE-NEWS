const express = require("express");
const {getTopics} = require("./controllers/topicsController")
const {getArticleById, patchArticleById} = require("./controllers/articlesController")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)












app.use((err, req, res, next) => {
    if (err.msg && err.status) {
        res.status(err.status).send({msg: err.msg})
    } else {
        res.status(404).send({msg: "Not found"})
    }
    
})

app.use("*", (req, res) => {
    res.status(404).send({msg: "Bad path"})
})

module.exports = app;