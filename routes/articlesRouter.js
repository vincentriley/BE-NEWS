const articlesRouter = require("express").Router();

const {
	getArticleComments,
	getArticles,
	getArticleById,
	patchArticleById,
	postComment,
	postArticle
} = require("../controllers/articlesController");

articlesRouter.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

articlesRouter.route("/:article_id/comments")
.get(getArticleComments)
.post(postComment)

module.exports = articlesRouter