const mongoose = require('mongoose');

// Định nghĩa mô hình Event
const eventSchema = new mongoose.Schema({
   userId: { type: String, ref: 'User', required: true },
   task: { type: String, required: true },
   completed: { type: Boolean},
   createdAt: { type: Date, default: Date.now },
   filter: { type: String, default: "Tất cả"}
});

module.exports = mongoose.model('Event', eventSchema, 'events');