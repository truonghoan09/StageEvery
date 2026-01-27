const express = require("express");
const router = express.Router();

const { googleAuth } = require("../controllers/auth.controller");
const { checkRateLimit } = require("../services/ratelimit.service");

/**
 * POST /auth/google
 * Google OAuth login / signup
 */
router.post("/google", async (req, res, next) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const ua = req.headers["user-agent"] || "unknown";

    const result = await checkRateLimit(ip, ua);

    if (!result.allowed) {
      return res.status(429).json({
        error: "RATE_LIMITED",
        retryAfter: result.retryAfter,
      });
    }

    return googleAuth(req, res, next);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
