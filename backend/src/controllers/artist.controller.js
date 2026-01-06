const { getArtistBySlug } = require('../services/artist.service')
const { db } = require('../firebase/firebase');

const { SOCIAL_DOMAIN_WHITELIST } = require('../constants/socialWhitelist');
const { validateAndNormalizeSocialLink } = require('../utils/validateSocialLink');

const getArtistPublic = async (req, res) => {
  try {
    const { slug } = req.params

    const artist = await getArtistBySlug(slug)

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    return res.json(artist)
  } catch (error) {
    console.error('[GET /artist/:slug]', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const updateArtistBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const payload = { ...req.body };

    const snapshot = await db
      .collection('artists')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (payload.socials) {
      const sanitized = sanitizeSocials(payload.socials);

      if (sanitized?.__error) {
        return res.status(400).json({
          message: 'Social link không hợp lệ',
          code: sanitized.__error.code,
          field: sanitized.__error.field,
        });
      }

      payload.socials = sanitized;
    }

    const docRef = snapshot.docs[0].ref;

    // 🔥 QUAN TRỌNG: dùng set + merge
    await docRef.set(payload, { merge: true });

    return res.json({ success: true });
  } catch (error) {
    console.error('[PUT /artist/:slug]', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

function sanitizeSocials(input) {
  if (!input || typeof input !== 'object') return undefined;

  const result = {};

  for (const key of Object.keys(input)) {
    const rawValue = input[key];
    if (!rawValue) continue;

    const allowedDomains = SOCIAL_DOMAIN_WHITELIST[key];
    if (!allowedDomains) continue;

    try {
      result[key] = validateAndNormalizeSocialLink(
        rawValue,
        allowedDomains
      );
    } catch (err) {
      return {
        __error: {
          code: err.message,
          field: key,
        },
      };
    }
  }

  return result;
}


module.exports = { getArtistPublic, updateArtistBySlug }
