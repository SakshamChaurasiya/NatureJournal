/**
 * @file user.model.js
 * @description Mongoose schema representing application users.
 */
const mongoose = require("mongoose");

/**
 * @schema User
 * @property {String} username - Unique username of the user
 * @property {String} email - Unique email address used for authentication
 * @property {String} password - Hashed user password
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
    },
    email: {
        type: String,
        unique: [true, "Account already exists with this email"],
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;