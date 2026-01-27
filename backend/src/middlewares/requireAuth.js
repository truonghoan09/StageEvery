const { db } = require("../firebase/firebase");

/**
 * Temporary auth middleware (MVP)
 * Expects: x-user-id header (googleId)
 */
module.exports = async function requireAuth(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHENTICATED",
      });
    }

    const userSnap = await db.collection("users").doc(userId).get();

    if (!userSnap.exists) {
      return res.status(401).json({
        error: "INVALID_USER",
      });
    }

    req.user = userSnap.data();
    next();
  } catch (err) {
    return res.status(500).json({
      error: "AUTH_MIDDLEWARE_ERROR",
    });
  }
};
