const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  userPlaces,
  searchPlaces,
  checkAvailability,
  deletePlace,
} = require('../controllers/placeController');

router.route('/').get(getPlaces);

// Protected routes (user must be logged in)
router.route('/add-places').post(isLoggedIn, addPlace);
router.route('/user-places').get(isLoggedIn, userPlaces);
router.route('/update-place').put(isLoggedIn, updatePlace);
router.route('/:id').delete(isLoggedIn, deletePlace);

// Availability check route
router.route('/availability/check').get(checkAvailability);

// Search route must come before :id to avoid being caught by it
router.route('/search/:key').get(searchPlaces)

// Not Protected routed but sequence should not be interfered with above routes
router.route('/:id').get(singlePlace);


module.exports = router;
