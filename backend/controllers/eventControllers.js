const Event = require('../models/events');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer only)
const createEvent = async (req, res) => {
    const { title, description, date, time, location, category, capacity, imageUrl } = req.body;

    // req.user comes from our 'protect' middleware
    const event = await Event.create({
        title,
        description,
        date,
        time,
        location,
        category,
        capacity,
        imageUrl,
        organizer: req.user._id // Links the event to the logged-in user
    });

    if (event) {
        res.status(201).json(event);
    } else {
        res.status(400);
        throw new Error('Invalid event data');
    }
};


const getEvents = async (req, res) => {
    // 🛠️ Optimization: Used .select() to only return basic info for frontend "Cards"
    // By only sending what's needed for the grid view, your API runs much faster!
    const events = await Event.find({})
        .select('title imageUrl date location category');
    
    res.json(events);
};

const getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

module.exports = { createEvent, getEvents, getEventById };