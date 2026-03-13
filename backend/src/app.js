/**
 * @file app.js
 * @description Initializes Express application,
 * configures middleware and registers API routes.
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");



const app = express();

/**
 * Enable CORS for frontend
 * Gracefully handles trailing slashes in VITE_API_BASE_URL to prevent CORS errors
 */
const allowedOrigin = process.env.VITE_API_BASE_URL 
    ? process.env.VITE_API_BASE_URL.replace(/\/$/, '') 
    : "http://localhost:5173";

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());


const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");



app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

module.exports = app;