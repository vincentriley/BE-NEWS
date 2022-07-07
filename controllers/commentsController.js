const removeComment = require("../models/commentsModel.js")

const deleteComment = (req, res, next) => {
	const {comment_id : commentId} = req.params
	removeComment(commentId).then(() => {
		res.status(204).send()
	}).catch((err) => {
		next(err)
	})
}

module.exports = deleteComment