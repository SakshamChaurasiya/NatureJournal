/**
 * @file server.js
 * @description Entry point of the application.
 * Loads environment variables, connects to MongoDB,
 * and starts the Express server.
 */
require("dotenv").config();
const app = require("./src/app");
const connectTODB = require("./src/config/db");


connectTODB();

const PORT = process.env.PORT || 5000;

/**
 * @function startServer
 * @description Starts the Express server on the configured port.
 */
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});