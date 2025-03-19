const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Import your routes and other modules
const userRoutes = require('./Routes/UserRoutes');
const dashboardRoutes = require('./Routes/DashboardRoutes');
const adminDashboardRoutes = require('./Routes/AdminDashboardRoutes');
const safetyTrendsRoutes = require('./Routes/SafetyTrendsRoutes');
const timelineSessionsRoutes = require('./Routes/TimelineSessionsRoutes');
const timelineCalendarRoutes = require('./Routes/TimelineCalendarRoutes');
const incidentTrendsRoutes = require('./Routes/IncidentTrendsRoutes');
const incidentHistoryRoutes = require('./Routes/IncidentHistoryRoutes');
const constructionSitesRoutes = require('./Routes/ConstructionSitesRoutes');
const camerasRoutes = require('./Routes/CamerasRouter');
const setupDbListener = require('./Database/dbListener');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, './.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://ellipsis.netlify.app', // Deployed frontend
];

// Enable CORS for all routes
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors());

// Log request origins (optional)
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// Define your API routes
app.use('/api', userRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', adminDashboardRoutes);
app.use('/api', safetyTrendsRoutes);
app.use('/api', timelineSessionsRoutes);
app.use('/api', timelineCalendarRoutes);
app.use('/api', incidentTrendsRoutes);
app.use('/api', incidentHistoryRoutes);
app.use('/api', constructionSitesRoutes);
app.use('/api', camerasRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

// Set up the database listener (if applicable)
setupDbListener(io);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });

  // Example: Handle new incidents
  socket.on('newIncident', (data) => {
    console.log('New incident:', data);
    io.emit('newIncident', data); // Broadcast to all clients
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
