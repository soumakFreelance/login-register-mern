const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { register, login, logout, getHome } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/home', auth, getHome);

module.exports = router;
