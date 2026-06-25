const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');

router.post('/toggle', isLoggedIn, toggleWishlist);
router.get('/', isLoggedIn, getWishlist);

module.exports = router;
