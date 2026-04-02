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

    const events = await Event.find({})
        .select('title imageUrl date time location category capacity');

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

const updateEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        // Only allow organizer who created the event to update it
        if (event.organizer.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this event');
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

const deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        if (event.organizer.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this event');
        }
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };