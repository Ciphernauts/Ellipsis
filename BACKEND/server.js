const express = require("express");
const cors = require('cors'); // Import cors
const userRoutes = require('./src/users/routes');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World");
});

app.use('/api/v1/users', userRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
