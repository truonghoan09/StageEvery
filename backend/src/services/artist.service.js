const { db } = require('../firebase/firebase')

const getArtistBySlug = async (slug) => {
  const snapshot = await db
    .collection('artists')
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
    id: doc.id,
    ...doc.data(),
  };
};


module.exports = {
  getArtistBySlug,
}
