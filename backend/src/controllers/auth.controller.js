const { checkRateLimit } = require('../services/rateLimit.service')

exports.sendMagicLink = async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress

  const userAgent = req.headers['user-agent'] || 'unknown'

  const result = await checkRateLimit(ip, userAgent)

  if (!result.allowed) {
    return res.status(429).json({
      allowed: false,
      retryAfter: result.retryAfter,
    })
  }

  return res.json({ allowed: true })
}


const crypto = require('crypto')
const { db } = require('../firebase/firebase')

function makeKey(ip, ua) {
  return crypto
    .createHash('sha256')
    .update(ip + ua)
    .digest('hex')
}

exports.markLoginSuccess = async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress

  const ua = req.headers['user-agent'] || 'unknown'
  const key = makeKey(ip, ua)

  const ref = db.collection('auth_rate_limits').doc(key)

  await ref.set(
    {
      count: 0,
      banLevel: 0,
      blockedUntil: null,
      firstAttemptAt: Date.now(),
      lastAttemptAt: Date.now(),
    },
    { merge: true }
  )

  res.json({ ok: true })
}
