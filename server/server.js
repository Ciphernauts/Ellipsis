const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const userRoutes = require("./Routes/UserRoutes");
const dashboardRoutes = require("./Routes/DashboardRoutes");
const adminDashboardRoutes = require("./Routes/AdminDashboardRoutes");
const safetyTrendsRoutes = require("./Routes/SafetyTrendsRoutes");
const timelineSessionsRoutes = require("./Routes/TimelineSessionsRoutes");
const timelineCalendarRoutes = require("./Routes/TimelineCalendarRoutes");
const incidentTrendsRoutes = require("./Routes/IncidentTrendsRoutes");
const incidentHistoryRoutes = require("./Routes/IncidentHistoryRoutes");
const constructionSitesRoutes = require("./Routes/ConstructionSitesRoutes");
const camerasRoutes = require("./Routes/CamerasRouter");
const setupDbListener = require("./Database/dbListener");

dotenv.config({ path: path.resolve(__dirname, "./.env") });

const app = express();
const PORT = 3000;

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://ellipsis.netlify.app", // Deployed frontend
];

// Enable CORS for all routes
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow credentials if needed
  })
);

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Allow requests from specified origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Ellipsis Website!" });
});

app.use("/api", userRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", adminDashboardRoutes);
app.use("/api", safetyTrendsRoutes);
app.use("/api", timelineSessionsRoutes);
app.use("/api", timelineCalendarRoutes);
app.use("/api", incidentTrendsRoutes);
app.use("/api", incidentHistoryRoutes);
app.use("/api", constructionSitesRoutes);
app.use("/api", camerasRoutes);

// Set up the database listener
setupDbListener(io); // Pass the Socket.io instance to the listener setup

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
