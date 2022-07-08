const {removeComment, updateComment} = require("../models/commentsModel.js")

const deleteComment = (req, res, next) => {
	const {comment_id : commentId} = req.params
	removeComment(commentId).then(() => {
		res.status(204).send()
	}).catch((err) => {
		next(err)
	})
}

const patchComment = (req, res, next) => {
	const {comment_id : commentId} = req.params
	const {inc_votes : votes} = req.body
	updateComment(commentId, votes).then((data) => {
		res.status(200).send({comment : data})
	}).catch((err) => {
		next(err)
	})
}

module.exports = {deleteComment, patchComment}