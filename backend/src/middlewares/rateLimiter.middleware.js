const rateLimit = require("express-rate-limit");

/**

* @middleware analyzeLimiter
* @description Limits how many times a user can call LLM analysis endpoints.
* Prevents abuse of the AI service.
  */
  const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
  message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
  });

module.exports = analyzeLimiter;
