const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createCheckout, verifyPayment, getUserPayments } = require('../controllers/paymentController');

router.post('/create-checkout', authenticate, createCheckout);
router.post('/verify', authenticate, verifyPayment);
router.get('/user', authenticate, getUserPayments);

module.exports = router;
