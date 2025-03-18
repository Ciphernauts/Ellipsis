const getUsers = "SELECT * FROM Users";
const getUserById = "SELECT * FROM users WHERE uid = $1";
const checkEmailExists = "SELECT * from users WHERE uemail = $1";
const removeUser = "DELETE FROM users WHERE uid = $1";
const updateUser = "UPDATE users SET username = $1 WHERE uid = $2";
const getUserByEmail = "SELECT * FROM users WHERE LOWER(uemail) = LOWER($1)";
const addUser = "INSERT INTO users (uemail, username, password, role, last_signin) VALUES ($1, $2, $3,'standard', NOW())";
const updateUserProfile = `
    UPDATE users
    SET
        username = COALESCE($1, username),
        uemail = COALESCE($2, uemail)
        ${'$3' === 'null' ? '' : ', password = COALESCE($3, password)'}
    WHERE uid = $4;
`;
module.exports = {
    getUsers,
    checkEmailExists,
    addUser,
    removeUser,
    getUserById,
    updateUserProfile,
    getUserByEmail
};
