const getUsers = "SELECT * FROM Users";
const getUserById = "SELECT * FROM users WHERE uid = $1";
const checkEmailExists = "SELECT * from users WHERE uemail = $1";
//const addUser = "INSERT INTO users (uid, username, uemail, password, role, last_signin) VALUES ($1, $2, $3, $4, $5, NOW())";
const removeUser = "DELETE FROM users WHERE uid = $1";
const updateUser = "UPDATE users SET username = $1 WHERE uid = $2";
const getUserByEmail = "SELECT * FROM users WHERE uemail = $1";
const addUser = "INSERT INTO users (username, uemail, password, role, last_signin) VALUES ($1, $2, $3, 'standard', NOW()) RETURNING *";
module.exports = {
    getUsers,
    checkEmailExists,
    addUser,
    removeUser,
    getUserById,
    updateUser,
    getUserByEmail
};