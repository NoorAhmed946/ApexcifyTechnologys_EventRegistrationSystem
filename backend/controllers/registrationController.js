const Registration = require('../models/registrations');
const Event = require('../models/events');

const registerForEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    //  Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    //  Check if already registered
    const alreadyRegistered = await Registration.findOne({ user: userId, event: eventId });
    if (alreadyRegistered) {
        res.status(400);
        throw new Error('You are already registered for this event');
    }

    // Create registration
    const registration = await Registration.create({
        user: userId,
        event: eventId
    });

    res.status(201).json({ message: 'Successfully registered!', registration });
};

const getMyRegistrations = async (req, res) => {
    const registrations = await Registration.find({ user: req.user._id }).populate('event');
    res.json(registrations);
};

module.exports = { registerForEvent, getMyRegistrations };