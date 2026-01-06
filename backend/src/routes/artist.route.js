const router = require('express').Router();

const {
  getArtistPublic,
  updateArtistBySlug,
} = require('../controllers/artist.controller');

router.get('/:slug', getArtistPublic);
router.put('/:slug', updateArtistBySlug);

module.exports = router;
