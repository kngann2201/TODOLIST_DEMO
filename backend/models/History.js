const mongoose = require('mongoose');

// Định nghĩa mô hình Event
const historySchema = new mongoose.Schema({
   userId: { type: String, ref: 'User', required: true },
   content: { type: String },
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema, 'histories');