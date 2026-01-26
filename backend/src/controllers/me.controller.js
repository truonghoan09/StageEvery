const admin = require('firebase-admin')

const db = admin.firestore()

exports.getMe = async (req, res) => {
  try {
    const { uid, email } = req.auth

    const ref = db.collection('users').doc(uid)
    const snap = await ref.get()

    // ❌ Chưa có system profile
    if (!snap.exists) {
      return res.json({
        hasProfile: false,
        missingFields: [
          'firstName',
          'lastName',
          'phone',
          'dob',
        ],
      })
    }

    const data = snap.data()

    // 🔍 Check thiếu field (phòng data cũ / incomplete)
    const requiredFields = [
      'firstName',
      'lastName',
      'phone',
      'dob',
    ]

    const missingFields = requiredFields.filter(
      (field) => !data[field]
    )

    if (missingFields.length > 0) {
      return res.json({
        hasProfile: false,
        missingFields,
      })
    }

    // ✅ OK
    return res.json({
      hasProfile: true,
      user: data,
    })
  } catch (err) {
    console.error('[ME] getMe failed', err)
    return res.status(500).json({
      message: 'Failed to get user profile',
    })
  }
}
