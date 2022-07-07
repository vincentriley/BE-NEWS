const express = require("express");
const {getTopics} = require("./controllers/topicsController")

const {getArticleComments, getArticles, getArticleById, patchArticleById, postComment, deleteComment} = require("./controllers/articlesController")

const getUsers = require("./controllers/usersController")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postComment)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.delete("/api/comments/:comment_id", deleteComment)




app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        err.status = 400
        err.msg = "Bad request"
    }
    next(err)
})


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