const { OAuth2Client } = require("google-auth-library");
const { db } = require("../firebase/firebase");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /auth/google
 * Body: { idToken }
 */
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      error: "MISSING_ID_TOKEN",
    });
  }

  let payload;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
  } catch (err) {
    return res.status(401).json({
      error: "INVALID_GOOGLE_TOKEN",
    });
  }

  const {
    sub: googleId,
    email,
    name,
    picture,
    email_verified,
  } = payload;

  if (!email || !email_verified) {
    return res.status(403).json({
      error: "EMAIL_NOT_VERIFIED",
    });
  }

  const userRef = db.collection("users").doc(googleId);
  const snap = await userRef.get();

  let user;

  if (!snap.exists) {
    user = {
      id: googleId,
      email,
      name,
      avatar: picture || null,
      provider: "google",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await userRef.set(user);
  } else {
    user = snap.data();

    await userRef.update({
      updatedAt: Date.now(),
    });
  }

  return res.json({
    user,
  });
};
