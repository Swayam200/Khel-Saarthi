const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({}).populate('host', 'name');
    res.json(events);
});

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('host', 'name email');

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Host only)
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location } = req.body;

    if (req.user.role !== 'host') {
        res.status(403);
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
        if (event.host.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('Hosts cannot register for their own event');
        }

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

// @desc    Get participants for an event
// @route   GET /api/events/:id/participants
// @access  Private (Host only)
const getEventParticipants = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('registeredParticipants', 'name email');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Ensure the person requesting is the host
    if (event.host.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('User is not authorized to view participants');
    }

    res.json(event.registeredParticipants);
});

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    registerForEvent,
    getEventParticipants,
};