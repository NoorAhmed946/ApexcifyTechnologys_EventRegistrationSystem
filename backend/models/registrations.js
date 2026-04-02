const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registeredAt: { type: Date, default: Date.now }
});

// This ensures a user can't register for the same event twice
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);