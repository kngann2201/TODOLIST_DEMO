const mongoose = require('mongoose');

// Định nghĩa mô hình To-Do
const todoSchema = new mongoose.Schema({
   userId: { type: String, ref: 'User', required: true },
   task: { type: String, required: true },
   completed: { type: Boolean},
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema, 'todos');
