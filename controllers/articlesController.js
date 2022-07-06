const {
	fetchArticleById,
	updateArticleVotes,
	fetchArticleComments,
} = require("../models/articlesModel");

const getArticleById = (req, res, next) => {
	const { article_id: articleId } = req.params;
	fetchArticleById(articleId)
		.then((data) => {
			res.status(200).send({ article: data });
		})
		.catch((err) => {
			next(err);
		});
};

const patchArticleById = (req, res, next) => {
	const { article_id: articleId } = req.params;
	const { inc_votes: votes } = req.body;
	updateArticleVotes(articleId, votes)
		.then((data) => {
			res.status(200).send({ article: data });
		})
		.catch((err) => {
			next(err);
		});
};

const getArticleComments = (req, res, next) => {
	const { article_id: articleId } = req.params;
	const promise1 = fetchArticleById(articleId);
	const promise2 = fetchArticleComments(articleId).then((data) => {
		res.status(200).send({ comments: data });
	});

	Promise.all([promise1, promise2]).catch((err) => {
		next(err);
	});
};

module.exports = { getArticleById, patchArticleById, getArticleComments };
