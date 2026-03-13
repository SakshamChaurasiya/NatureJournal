/**
 * @file journal.routes.js
 * @description Defines all journal related routes including:
 * - creating journal entries
 * - retrieving user journals
 * - analyzing journal text
 * - generating user insights
 */
const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const analyzeLimiter = require("../middlewares/rateLimiter.middleware");
const journalController = require("../controllers/journal.controller");

const journalRouter = Router();

/**
 * @route POST /api/journal
 * @description Create a journal
 * @access Private
 * Rate limiting applied to LLM endpoints to prevent abuse
 * and control API cost.
*/

journalRouter.post("/", authMiddleware, analyzeLimiter, journalController.createJournalEntry);

/**
 * @route GET /api/journal
 * @description Get all journals created by user
 * @access Private
*/
journalRouter.get("/", authMiddleware, journalController.getUserJournals);

/**
 * @route POST /api/journal/analyze
 * @description Analyze the text sent by user not saved in database
 * @access Private
 * Rate limiting applied to LLM endpoints to prevent abuse
 * and control API cost.
*/
journalRouter.post("/analyze", authMiddleware, analyzeLimiter, journalController.analyzeJournal);

/**
 * @route GET /api/journal/insights
 * @description Get insights of the user
 * @access Private
*/
journalRouter.get("/insights", authMiddleware, journalController.getInsights);

module.exports = journalRouter;