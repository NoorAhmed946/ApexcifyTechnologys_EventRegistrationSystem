const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations } = require('../controllers/registrationController');
const { protect, isOrganizer } = require('../middlewares/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.delete('/:eventId', protect, cancelRegistration);
router.get('/my-events', protect, getMyRegistrations);
router.get('/event/:eventId', protect, isOrganizer, getEventRegistrations);

module.exports = router;