const express = require("express");
const {getTopics} = require("./controllers/topicsController")

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
    res.status(404).send({msg: "Not found"})
})

app.use((err, req, res, next) => {
    res.status(404).send(err)
})

module.exports = app;