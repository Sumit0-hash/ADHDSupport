// server/src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js'; 

// Import all route handlers
import userRoutes from './routes/users.js';
import habitRoutes from './routes/habits.js';
import courseRoutes from './routes/courses.js';
import resourceRoutes from './routes/resources.js';
import eventRoutes from './routes/events.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- Middleware Setup ---
// Enable CORS for all origins (or restrict in production)
app.use(cors());
// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// --- Database Connection ---
connectDB();

// --- Route Registration ---
// Define base paths for each route file
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});