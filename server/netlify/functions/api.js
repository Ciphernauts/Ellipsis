import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../Routes/UserRoutes";
import timelineSessionsRoutes from "../Routes/TimelineSessionsRoutes";
import timelineCalendarRoutes from "../Routes/TimelineCalendarRoutes";
import incidentTrendsRoutes from "../Routes/IncidentTrendsRoutes";
import incidentHistoryRoutes from "../Routes/IncidentHistoryRoutes";
import constructionSitesRoutes from "../Routes/ConstructionSitesRoutes";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Define routes
app.use("/api/users", userRoutes);
app.use("/api/timeline-sessions", timelineSessionsRoutes);
app.use("/api/timeline-calendar", timelineCalendarRoutes);
app.use("/api/incident-trends", incidentTrendsRoutes);
app.use("/api/incident-history", incidentHistoryRoutes);
app.use("/api/construction-sites", constructionSitesRoutes);

// Export serverless handler
module.exports.handler = serverless(app);
