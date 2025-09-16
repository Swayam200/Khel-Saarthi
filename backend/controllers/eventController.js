const asyncHandler = require('express-async-handler');
const Event = require('../models/eventModel');

// @desc    Get all events with filtering
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
    const { category, skillLevel, maxFee, search, startDate, endDate } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (maxFee) filter.entryFee = { $lte: parseInt(maxFee) }; // lte = less than or equal to
    if (search) filter.title = { $regex: search, $options: 'i' }; // regex for case-insensitive search

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate); // gte = greater than or equal to
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const events = await Event.find(filter).populate('host', 'name');
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

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Host only)
const updateEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location, category, skillLevel, entryFee } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if the user is the host
    if (event.host.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('User not authorized to update this event');
    }

    // Update all fields from the request body
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.skillLevel = skillLevel || event.skillLevel;
    event.entryFee = entryFee !== undefined ? entryFee : event.entryFee;


    const updatedEvent = await event.save();
    res.json(updatedEvent);
});


module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    registerForEvent,
    getEventParticipants,
    updateEvent,
};