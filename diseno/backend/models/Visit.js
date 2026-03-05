const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  code: { type: String, required: true, index: true },
  ip: String,
  country: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', VisitSchema);
