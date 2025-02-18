const mongoose = require('mongoose');

// Định nghĩa mô hình Event
const labelSchema = new mongoose.Schema({
   userId: { type: String, ref: 'User', required: true },
   label: { type: String, required: true }
});

module.exports = mongoose.model('Label', labelSchema, 'labels');