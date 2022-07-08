const db = require("../db/connection.js");

const removeComment = (commentId) => {
	return db
		.query("DELETE FROM comments WHERE comment_id = $1", [commentId])
		.then(({ rowCount }) => {
			if (rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: "Not found",
				});
			}
		});
};

const updateComment = (commentId, votes) => {
	return db
		.query(
			"UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
			[votes, commentId]
		)
		.then(({ rows }) => {
			const comment = rows[0];
			if (!comment) {
				return Promise.reject({
					status: 404,
					msg: `Not found`
				});
			}
			return comment;
		});
};

module.exports = { removeComment, updateComment };
