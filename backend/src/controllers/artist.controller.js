const { getArtistBySlug } = require('../services/artist.service')
const { db } = require('../firebase/firebase');

const { SOCIAL_DOMAIN_WHITELIST } = require('../constants/socialWhitelist');
const { validateAndNormalizeSocialLink } = require('../utils/validateSocialLink');

const ALLOWED_UPDATE_FIELDS = [
  'name',
  'bio',
  'avatar',
  'cover',
  'socials',
  'theme',
  'tracks',
  'videos',
];

function normalizeTheme(theme) {
  if (!theme || typeof theme !== 'object') {
    return { paletteId: 'neutral-balance' };
  }

  if (!theme.paletteId || typeof theme.paletteId !== 'string') {
    return { paletteId: 'neutral-balance' };
  }

  return {
    paletteId: theme.paletteId,
  };
}


const getArtistPublic = async (req, res) => {
  try {
    const { slug } = req.params;

    const artist = await getArtistBySlug(slug);

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (artist.status && artist.status !== 'active') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const publicArtist = {
      // ======================
      // Core
      // ======================
      id: artist.id,
      slug: artist.slug,
      name: artist.name,

      // ======================
      // Visual
      // ======================
      avatarUrl: artist.avatarUrl,
      coverUrl: artist.coverUrl,

      // ======================
      // Identity
      // ======================
      tagline: artist.tagline,
      bio: typeof artist.bio === 'object' ? artist.bio : undefined,
      genres: Array.isArray(artist.genres) ? artist.genres : undefined,
      location: artist.location,

      // ======================
      // Social / Contact
      // ======================
      socials: artist.socials || {},

      // ======================
      // Music
      // ======================
      tracks: Array.isArray(artist.tracks) ? artist.tracks : [],

      // ======================
      // Optional future
      // ======================
      gallery: Array.isArray(artist.gallery) ? artist.gallery : undefined,

      // ======================
      // Theme (BẮT BUỘC)
      // ======================
      theme: normalizeTheme(artist.theme),
    };



    return res.json(publicArtist);
  } catch (error) {
    console.error('[GET /artist/:slug]', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateArtistBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const payload = {};

    for (const key of ALLOWED_UPDATE_FIELDS) {
      if (req.body[key] !== undefined) {
        payload[key] = req.body[key];
      }
    }

    const PALETTE_WHITELIST = [
      'organic-calm',
      'warm-indie',
      'cool-digital',
      'deep-night',
      'soft-dream',
      'neutral-balance',
      'monochrome-art',
    ];

    if (payload.theme?.paletteId) {
      if (!PALETTE_WHITELIST.includes(payload.theme.paletteId)) {
        return res.status(400).json({
          message: 'Invalid paletteId',
        });
      }
    }



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
