const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    createEvent,
    registerForEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Define routes
router.get('/', getAllEvents); // Publicly viewable
router.post('/', protect, createEvent); // Must be logged in as a host
router.post('/:id/register', protect, registerForEvent); // Must be logged in

module.exports = router;

