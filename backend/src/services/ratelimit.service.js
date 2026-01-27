const crypto = require('crypto')
const { db } = require('../firebase/firebase')

const WINDOW_MS = 7 * 60 * 1000
const MAX_ATTEMPTS = 5

function makeKey(ip, ua) {
  return crypto
    .createHash('sha256')
    .update(ip + ua)
    .digest('hex')
}


exports.checkRateLimit = async (ip, ua) => {
  const key = makeKey(ip, ua)
  const ref = db.collection('auth_rate_limits').doc(key)
  const now = Date.now()

  const snap = await ref.get()

  if (!snap.exists) {
    await ref.set({
      count: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
    })
    return { allowed: true }
  }

  const data = snap.data()

  if (data.blockedUntil && now < data.blockedUntil) {
    return {
      allowed: false,
      retryAfter: Math.ceil((data.blockedUntil - now) / 1000),
    }
  }

  if (now - data.firstAttemptAt > WINDOW_MS) {
    await ref.set({
      count: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
    })
    return { allowed: true }
  }

  const count = data.count + 1

  if (count > MAX_ATTEMPTS) {
    const blockMs = 60 * 60 * 1000 // 1h
    await ref.update({
      blockedUntil: now + blockMs,
      lastAttemptAt: now,
    })

    return {
      allowed: false,
      retryAfter: Math.ceil(blockMs / 1000),
    }
  }

  await ref.update({
    count,
    lastAttemptAt: now,
  })

  return { allowed: true }
}
