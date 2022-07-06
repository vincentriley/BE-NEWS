const db = require("../db/connection.js");

const fetchArticles = (sortBy, order, topic) => {
	const allowedSortBys = [
		"author",
		"title",
		"article_id",
		"topic",
		"created_at",
		"votes",
		"comment_count",
	];
	const allowedOrderByBools = ["true", "false"];
	console.log(!allowedSortBys.includes(sortBy), "bool")
	if (!allowedSortBys.includes(sortBy)) {
		console.log("in conditional")
		return Promise.reject({
			status: 400,
			msg: "Bad request",
		});
	}
	console.log(order, "order")
	if (order && !allowedOrderByBools.includes(order)) {
		console.log("in conditional2")
		return Promise.reject({
			status: 400,
			msg: "Bad request",
		});
	}
	const sortByString = sortBy ? sortBy : "created_at";
	const orderString = order ? order : "DESC";
	const topicString = topic ? `WHERE articles.topic = '${topic}'` : "";
	return db
		.query(
			`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles
			LEFT JOIN comments 
			ON articles.article_id = comments.article_id
			${topicString}
			GROUP BY articles.article_id
			ORDER BY articles.${sortByString} ${orderString};`
		)
		.then(({ rows }) => {
			return rows;
		});
};

const fetchArticleById = (articleId) => {
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
					msg: `Not found`,
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
					msg: `Not found`,
				});
			}
			return article;
		});
};

const fetchArticleComments = (articleId) => {
	return db
		.query("SELECT * FROM comments WHERE article_id = $1", [articleId])
		.then(({ rows }) => {
			return rows;
		});
};

module.exports = {
	fetchArticles,
	fetchArticleById,
	updateArticleVotes,
	fetchArticleComments,
};
