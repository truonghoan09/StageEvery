const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');

const {
  getArtistPublic,
  updateArtistBySlug,
} = require('../controllers/artist.controller');

router.get('/:slug', getArtistPublic);
router.put('/:slug', requireAuth, updateArtistBySlug);

module.exports = router;
