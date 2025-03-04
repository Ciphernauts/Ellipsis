const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");
const { fileURLToPath } = require("url");
const userRoutes = require("./Routes/UserRoutes");
const timelineSessionsRoutes = require("./Routes/TimelineSessionsRoutes");
const timelineCalendarRoutes = require("./Routes/TimelineCalendarRoutes");
const incidentTrendsRoutes = require("./Routes/IncidentTrendsRoutes");
const incidentHistoryRoutes = require("./Routes/IncidentHistoryRoutes");
const constructionSitesRoutes = require("./Routes/ConstructionSitesRoutes");
const camerasRoutes = require('./Routes/CamerasRouter');


//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();
const PORT = 3000

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.json({message: "Welcome to the Ellipsis Website!"});
});

app.use('/api/users', userRoutes);
app.use('', timelineSessionsRoutes);
app.use('', timelineCalendarRoutes);
app.use('', incidentTrendsRoutes);
app.use('', incidentHistoryRoutes);
app.use('', constructionSitesRoutes);
app.use('/api', camerasRoutes);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
