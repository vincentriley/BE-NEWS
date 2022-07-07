const articlesRouter = require("express").Router();

const {
	getArticleComments,
	getArticles,
	getArticleById,
	patchArticleById,
	postComment,
} = require("../controllers/articlesController");

articlesRouter.get("/", getArticles)

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

articlesRouter.route("/:article_id/comments")
.get(getArticleComments)
.post(postComment)

module.exports = articlesRouter