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

const cancelRegistration = async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const registration = await Registration.findOne({ user: userId, event: eventId });
    if (!registration) {
        res.status(404);
        throw new Error('Registration not found');
    }

    await registration.deleteOne();
    res.json({ message: 'Registration cancelled' });
};

const getEventRegistrations = async (req, res) => {
    const eventId = req.params.eventId;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }
    
    // Verify organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to view attendees for this event');
    }

    const registrations = await Registration.find({ event: eventId }).populate('user', 'name email phone');
    res.json(registrations);
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations };