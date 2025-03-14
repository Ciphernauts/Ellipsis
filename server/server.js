const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { fileURLToPath } = require("url");
const userRoutes = require("./Routes/UserRoutes");
const safetyTrendsRoutes = require("./Routes/SafetyTrendsRoutes");
const timelineSessionsRoutes = require("./Routes/TimelineSessionsRoutes");
const timelineCalendarRoutes = require("./Routes/TimelineCalendarRoutes");
const incidentTrendsRoutes = require("./Routes/IncidentTrendsRoutes");
const incidentHistoryRoutes = require("./Routes/IncidentHistoryRoutes");
const constructionSitesRoutes = require("./Routes/ConstructionSitesRoutes");
const camerasRoutes = require("./Routes/CamerasRouter");

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Ellipsis Website!" });
});

app.use("/api", userRoutes);
app.use("/api", safetyTrendsRoutes);
app.use("/api", timelineSessionsRoutes);
app.use("/api", timelineCalendarRoutes);
app.use("/api", incidentTrendsRoutes);
app.use("/api", incidentHistoryRoutes);
app.use("/api", constructionSitesRoutes);
app.use("/api", camerasRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
