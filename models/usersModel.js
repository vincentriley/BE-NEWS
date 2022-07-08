const db = require("../db/connection.js");

const fetchUsers = () => {
    return db.query("SELECT * FROM users")
    .then(({rows}) => {
        return rows
    })
}

const fetchUserByUsername = (username) => {
    return db.query("SELECT * FROM users WHERE username = $1", [username])
    .then(({rows}) => {
        const username = rows[0]
        if (!username) {
            return Promise.reject({
                status: 404,
                msg: `Not found`,
            });
        }
        return username
    })
}

module.exports = {fetchUsers, fetchUserByUsername}