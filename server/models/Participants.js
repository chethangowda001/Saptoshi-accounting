// models/Participant.js

const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userPhoneNo: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Participant', ParticipantSchema);
