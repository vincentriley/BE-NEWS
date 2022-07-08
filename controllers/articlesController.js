const {
	fetchArticles,
	fetchArticleById,
	updateArticleVotes,
	addComment,
	fetchArticleComments,
	checkTopicExists,
	addArticle
} = require("../models/articlesModel");

const getArticles = (req, res, next) => {
	const { sort_by: sortBy, order, topic } = req.query;
	const pendingTopicCheck = checkTopicExists(topic);
	const pendingArticles = fetchArticles(sortBy, order, topic);
	

	Promise.all([pendingArticles, pendingTopicCheck])
		.then(([data]) => {
			res.status(200).send({ articles: data });
		})
		.catch((err) => {
			next(err);
		});
};

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

const postComment = (req, res, next) => {
	const { article_id: articleId } = req.params;
	const { username, body } = req.body;

	addComment(articleId, username, body)
		.then((data) => {
			res.status(201).send({ comment: data });
		})
		.catch((err) => {
			next(err);
		});
};

const getArticleComments = (req, res, next) => {
	const { article_id: articleId } = req.params;
	const pendingComments = fetchArticleComments(articleId);
	const pendingArticleCheck = fetchArticleById(articleId);

	Promise.all([pendingComments, pendingArticleCheck])
		.then(([data]) => {
			res.status(200).send({ comments: data });
		})
		.catch((err) => {
			next(err);
		});
};

const postArticle = (req, res, next) => {
	const article = req.body
	addArticle(article).then((data) => {
		res.status(201).send({article: data})
	})
	.catch((err) => {
		console.log(err)
		next(err)
	})
}



module.exports = {
	getArticles,
	getArticleById,
	patchArticleById,
	postComment,
	getArticleComments,
	postArticle
};
