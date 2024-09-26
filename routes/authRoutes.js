const express = require('express');
const {
  registerController,
  loginController,
} = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
const router = express.Router();

router.post('/register', limiter, registerController);
router.post('/login', limiter, loginController);
module.exports = router;
