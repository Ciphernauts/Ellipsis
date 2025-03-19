const pool = require('../Database/database');
const queries = require('../Queries/UserQueries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error,results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUserById = (req,res) => {
    const uid = parseInt(req.params.uid);
    pool.query(queries.getUserById, [uid], (error,results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

/*
const addUser = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Reset sequence before inserting new user
    pool.query("SELECT setval('users_uid_seq', COALESCE((SELECT MAX(uid) FROM users), 1), false);", (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error resetting user ID sequence" });
        }

    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.rows.length) {
            return res.status(400).json({ message: "Email already exists" });
        }

        pool.query(queries.addUser, [Date.now(), username, email, password, "standard"], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: "Error inserting user" });
            }
            res.status(201).json({ message: "User Created Successfully!" });
        });
    });
});
};
*/

const addUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(queries.checkEmailExists, [email], (error, results) => {
            if (error) throw error;

            if (results.rows.length) {
                return res.status(400).json({ message: "Email already exists" });
            }

            pool.query(queries.addUser, [username, email, hashedPassword], (error, results) => {
                if (error) throw error;
                res.status(201).json({ message: "User Created Successfully!", user: results.rows[0] });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


const removeUser = (req, res) => {
    const uid = parseInt(req.params.uid);

    pool.query(queries.getUserById, [uid], (error,results) => {
        if (error) throw error;

        const noUserFound = !results.rows.length;
        if(noUserFound) {
            return res.status(404).send("User does not exist in the database!");
        }

        pool.query(queries.removeUser, [uid], (error,results) => {
            if(error) throw error;
            res.status(200).send("User removed successfully!");
        });
    });
};

const updateUser = (req, res) => {
    const uid = parseInt(req.params.uid);
    const { username } = req.body;

    pool.query(queries.getUserById, [uid], (error,results) => {
        if (error) throw error;
        
        const noUserFound = !results.rows.length;
        if(noUserFound) {
            return res.status(404).send("User does not exist in the database!");
        }

        pool.query(queries.updateUser, [username, uid], (error,results) => {
            if (error) throw error;
            res.status(200).send("User updated successfully!");
        });
    });
    
};

const updateUserProfile = async (req, res) => {
    const { username, email, password } = req.body;
    const uid = req.user.uid;  // Extract UID from JWT token

    try {
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        pool.query(
            queries.updateUserProfile,
            [username, email, hashedPassword, uid],
            (error, results) => {
                if (error) {
                    return res.status(500).json({ message: 'Error updating profile' });
                }
                res.status(200).json({ message: 'Profile updated successfully!' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/*
const loginUser = (req, res) => {
    const { email, password } = req.body;

    pool.query(queries.getUserByEmail, [email], (error, results) => {
        if (error) throw error;

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results.rows[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }

            res.status(200).json({ message: "Login successful", user });
        });
    });
};
*/

const loginUser = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    email = email.trim().toLowerCase();

    if (email === "admin@pejman-jouzi.com" && password === "Admin@123") {
        const token = jwt.sign(
            { email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            message: "Login successful",
            user: { email, role: 'admin' },
            token
        });
    }

    try {
        const result = await pool.query(queries.getUserByEmail, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { uid: user.uid, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            user: { uid: user.uid, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/*

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(queries.addUser, [username, email, hashedPassword], (error, results) => {
        if (error) throw error;
        res.status(201).json({ message: "User registered successfully", user: results.rows[0] });
    });
};
*/

const registerUser = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(queries.addUser, [email, username, hashedPassword]);
        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    getUsers,
    getUserById,
    addUser,
    removeUser,
    updateUserProfile,
    loginUser,
    registerUser
};
