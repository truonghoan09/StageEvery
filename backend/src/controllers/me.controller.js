const { db } = require('../firebase/firebase')

/**
 * GET /me
 * Requires requireAuth middleware
 */
exports.getMe = async (req, res) => {
  try {
    // 🔥 ĐÃ VERIFY Ở requireAuth
    const user = req.user

    if (!user || !user.id) {
      return res.status(401).json({
        error: 'UNAUTHENTICATED',
      })
    }

    const userRef = db.collection('users').doc(user.id)
    const snap = await userRef.get()

    if (!snap.exists) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
      })
    }

    const data = snap.data()

    const hasProfile =
      Boolean(data.firstName) &&
      Boolean(data.lastName) &&
      Boolean(data.phone) &&
      Boolean(data.dob)

    const missingFields = []
    if (!data.firstName) missingFields.push('firstName')
    if (!data.lastName) missingFields.push('lastName')
    if (!data.phone) missingFields.push('phone')
    if (!data.dob) missingFields.push('dob')

    return res.json({
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
      },
      hasProfile,
      missingFields,
    })
  } catch (err) {
    console.error('[ME] getMe failed', err)
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
    })
  }
}
