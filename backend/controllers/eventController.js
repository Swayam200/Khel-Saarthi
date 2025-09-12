const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({}).populate('host', 'name'); // Also fetch host's name
    res.json(events);
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Host only)
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location } = req.body;

    if (req.user.role !== 'host') {
        res.status(403); // Forbidden
        throw new Error('User is not a host');
    }

    const event = new Event({
        title,
        description,
        date,
        location,
        host: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
});

// @desc    Register a user for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        if (event.registeredParticipants.includes(req.user._id)) {
            res.status(400);
            throw new Error('User already registered for this event');
        }
        event.registeredParticipants.push(req.user._id);
        await event.save();
        res.json({ message: 'Registered for event successfully' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

module.exports = {
    getAllEvents,
    createEvent,
    registerForEvent,
};