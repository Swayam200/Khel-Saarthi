const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMyEvents } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Define routes and link them to controller functions
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/myevents', protect, getMyEvents);

module.exports = router;