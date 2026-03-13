/**
 * @file auth.routes.js
 * @description Defines authentication routes including
 * user registration and login.
 */
const { Router } = require("express");
const authController = require("../controllers/auth.controller");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
*/
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
*/
authRouter.post("/login", authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout user
 * @access Public
*/
authRouter.post("/logout", authController.logoutUserController);

module.exports = authRouter;