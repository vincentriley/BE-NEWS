const db = require("../db/connection.js");
const convertTimeStampToDate = require("../db/helpers/utils")

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
	const allowedOrderByBools = ["desc", "asc"];
	if ((sortBy && !allowedSortBys.includes(sortBy)) || (order && !allowedOrderByBools.includes(order))) {
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
					msg: `Not found`
				});
			}
			return article;
		});
};


const addComment = (articleId, username, body) => {
	return db
		.query(
			`INSERT INTO comments (body, author, article_id)
					VALUES($1, $2, $3) RETURNING *`,
			[body, username, articleId]
		)
		.then(({rows}) => {
			const comment = rows[0]
			return comment
		});
};


const fetchArticleComments = (articleId) => {
	return db
		.query("SELECT * FROM comments WHERE article_id = $1", [articleId])
		.then(({ rows }) => {
			return rows;
		});
};




const checkTopicExists = (topic) => {
	const topicString = topic ? topic : "%"
	return db
		.query("SELECT * FROM topics WHERE slug LIKE $1", [topicString])
		.then(({rows}) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `Not found`
				})
			} else {
				return Promise.resolve()
			}
		});
}


const addArticle = (article) => {
	return db
		.query(
			`INSERT INTO articles (author, title, body, topic)
					VALUES($1, $2, $3, $4) RETURNING *`,
			[article.author, article.title, article.body, article.topic]
		)
		.then(({rows}) => {
			const {article_id : articleId} = rows[0]
			return fetchArticleById(articleId)
		})
};



module.exports = { fetchArticles, fetchArticleById, updateArticleVotes, fetchArticleComments, addComment, checkTopicExists, addArticle };


