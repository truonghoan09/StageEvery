const { db } = require('../firebase/firebase')

const getArtistBySlug = async (slug) => {
  const snapshot = await db
    .collection('artists')
    .where('slug', '==', slug)
    .limit(1)
    .get()

  if (snapshot.empty) return null

  return snapshot.docs[0].data()
}

module.exports = {
  getArtistBySlug,
}
