const express = require("express")
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventControllers');
const { protect, isOrganizer } = require('../middlewares/authMiddleware');
const { validateEvent } = require('../middlewares/validationMiddleware');

router.route('/').get(getEvents).post(protect, isOrganizer, validateEvent, createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, isOrganizer, updateEvent)
    .delete(protect, isOrganizer, deleteEvent);

module.exports = router;