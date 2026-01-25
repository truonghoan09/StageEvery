const router = require('express').Router();
const verifyFirebaseToken = require('../middlewares/verifyFirebaseToken')

const {
  getArtistPublic,
  updateArtistBySlug,
} = require('../controllers/artist.controller');

router.get('/:slug', getArtistPublic);
router.put('/:slug', verifyFirebaseToken, updateArtistBySlug);

module.exports = router;
