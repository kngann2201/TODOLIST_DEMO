const mongoose = require('mongoose');

// Định nghĩa mô hình To-Do
const todoSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   content: { type: String, required: true },
   isCompleted: { type: Boolean, default: false },
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
