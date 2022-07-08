const {fetchUsers, fetchUserByUsername} = require("../models/usersModel")

const getUsers = (req, res, next) => {
    fetchUsers().then((data) => {
        res.status(200).send({users: data})
    }).catch((err) => {
        next(err)
    })
}

const getUserByUsername = (req, res, next) => {
    const {username} = req.params
    fetchUserByUsername(username).then((data) => {
        res.status(200).send({user: data})
    }).catch((err) => {
        next(err)
    })
}

module.exports = {getUsers, getUserByUsername}