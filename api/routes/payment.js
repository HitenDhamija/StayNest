const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');
const { createOrder, verifyPayment, getPaymentConfig } = require('../controllers/paymentController');

router.get('/config', getPaymentConfig);
router.post('/create-order', isLoggedIn, createOrder);
router.post('/verify', isLoggedIn, verifyPayment);

module.exports = router;
