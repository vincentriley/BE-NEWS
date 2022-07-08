const express = require("express");

const getApi = require("./controllers/apiController")

const topicsRouter = require("./routes/topicsRouter")

const articlesRouter = require("./routes/articlesRouter")

const usersRouter = require("./routes/usersRouter")

const commentsRouter = require("./routes/commentsRouter")

const app = express();

app.use(express.json());

app.get("/api", getApi)

app.use("/api/topics", topicsRouter)

app.use("/api/articles", articlesRouter)

app.use("/api/users", usersRouter)

app.use("/api/comments", commentsRouter)





app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
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