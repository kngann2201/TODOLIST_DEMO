const mongoose = require('mongoose');

// Định nghĩa mô hình Diary
const diarySchema = new mongoose.Schema({
   userId: { type: String, ref: 'User', required: true },
   task: { type: String, required: true },
   content:{ type: String, required: true  },
   createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diary', diarySchema, 'diaries');