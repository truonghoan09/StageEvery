exports.getMe = async (req, res) => {
  const { uid, email } = req.auth

  const ref = db.collection('users').doc(uid)
  const snap = await ref.get()

  if (!snap.exists) {
    return res.json({ hasProfile: false })
  }

  return res.json({
    hasProfile: true,
    user: snap.data(),
  })
}
