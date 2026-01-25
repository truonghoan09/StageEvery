exports.createUserProfile = async (req, res) => {
  const { uid, email } = req.auth
  const { fullName, phone } = req.body

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'INVALID_PAYLOAD' })
  }

  const ref = db.collection('users').doc(uid)
  const snap = await ref.get()

  if (snap.exists) {
    return res.status(409).json({ error: 'PROFILE_EXISTS' })
  }

  await ref.set({
    email,
    fullName,
    phone,
    createdAt: Date.now(),
  })

  res.json({ ok: true })
}
