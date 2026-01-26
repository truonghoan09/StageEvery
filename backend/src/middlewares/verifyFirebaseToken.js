const admin = require('firebase-admin')

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Missing Authorization header',
    })
  }

  const token = authHeader.split(' ')[1]

  // ✅ FAKE AUTH (DEV ONLY)
  if (
    process.env.NODE_ENV !== 'production' &&
    token === 'FAKE_TOKEN'
  ) {
    req.auth = {
      uid: 'fake-user-123',
      email: 'fake@stageevery.dev',
    }
    return next()
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token)

    req.auth = {
      uid: decoded.uid,
      email: decoded.email,
    }

    next()
  } catch (error) {
    console.error('[Auth] Invalid token', error)

    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}

module.exports = verifyFirebaseToken
