const express = require("express")
const router = express.Router();
const { createEvent, getEvents, getEventById } = require('../controllers/eventControllers');
const { protect, isOrganizer } = require('../middlewares/authMiddleware');
const { validateEvent } = require('../middlewares/validationMiddleware');

router.route('/').get(getEvents).post(protect, isOrganizer, validateEvent, createEvent);

router.route('/:id').get(getEventById);

module.exports = router;