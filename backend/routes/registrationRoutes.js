const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/:eventId', protect, registerForEvent);
router.get('/my-events', protect, getMyRegistrations);

module.exports = router;