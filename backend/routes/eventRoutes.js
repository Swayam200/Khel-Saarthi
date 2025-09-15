const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById, // Import the new function
    createEvent,
    registerForEvent,
    getEventParticipants,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Define routes
router.route('/').get(getAllEvents).post(protect, createEvent);
router.route('/:id').get(getEventById);
router.route('/:id/register').post(protect, registerForEvent);
router.route('/:id/participants').get(protect, getEventParticipants);

module.exports = router;