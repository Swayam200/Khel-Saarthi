const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    registerForEvent,
    getEventParticipants,
    getChatHistory,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getAllEvents).post(protect, createEvent);
router.route('/:id').get(getEventById).put(protect, updateEvent);
router.route('/:id/register').post(protect, registerForEvent);
router.route('/:id/participants').get(protect, getEventParticipants);
router.route('/:id/chat').get(protect, getChatHistory);

module.exports = router;