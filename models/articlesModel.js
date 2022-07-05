const db = require("../db/connection.js");

const fetchArticleById = (articleId) => {
	// if (isNaN(parseInt(articleId))) {
	// 	return Promise.reject({
	// 		status: 400,
	// 		msg: "Bad request",
	// 	});
	// }
	return db
		.query(
			`SELECT articles.*, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles
        LEFT JOIN comments 
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
			[articleId]
		)
		.then(({ rows }) => {
			const article = rows[0];
			if (!article) {
				return Promise.reject({
					status: 404,
					msg: `No article found for article_id ${articleId}`,
				});
			}
			return article;
		});
};

const updateArticleVotes = (articleId, votes) => {
	if (isNaN(parseInt(articleId)) || isNaN(parseInt(votes))) {
		return Promise.reject({
			status: 400,
			msg: "Bad request",
		});
	}
	return db
		.query(
			"UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
			[votes, articleId]
		)
		.then(({ rows }) => {
			const article = rows[0];
			if (!article) {
				return Promise.reject({
					status: 404,
					msg: `No article found for article_id ${articleId}`,
				});
			}
			return article;
		});
};

module.exports = { fetchArticleById, updateArticleVotes };
