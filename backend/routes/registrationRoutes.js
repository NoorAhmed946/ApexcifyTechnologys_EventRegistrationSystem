const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, cancelRegistration } = require('../controllers/registrationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.delete('/:eventId', protect, cancelRegistration);
router.get('/my-events', protect, getMyRegistrations);

module.exports = router;