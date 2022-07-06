
const {fetchArticles, fetchArticleById, updateArticleVotes, fetchArticleComments} = require("../models/articlesModel")

const getArticles = (req, res, next) => {
	const {sort_by : sortBy, order, topic} = req.query
    fetchArticles(sortBy, order, topic).then((data) => {
        res.status(200).send({articles: data})
    }).catch((err) => {
        next(err)
    })
}


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

module.exports = { getArticles, getArticleById, patchArticleById, getArticleComments };

