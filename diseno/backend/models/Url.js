const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  original: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Url', UrlSchema);
