/**
 * @file db.js
 * @description MongoDB connection configuration using Mongoose.
 * Establishes connection with the database using the URI from environment variables.
 */
const mongoose = require("mongoose");

/**
 * @function connectTODB
 * @description Connects the application to MongoDB using Mongoose.
 * Logs success or error messages in the console.
 */
async function connectTODB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to database");
    } catch (err) {
        res.status(503).json({
            message: "Service Unavailable",
            error: err.message
        })
    }
}

module.exports = connectTODB;