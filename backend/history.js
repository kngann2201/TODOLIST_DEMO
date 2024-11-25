const express = require('express');
const mongoose = require('mongoose');
const History = require('./models/History');
const User = require('./models/User');
const router = express.Router();

//Lấy danh sách 
router.get('/list/:userId', async (req, res) => {
    try {
       const { userId } = req.params;
       const tasks = await History.find({ userId }).select('content createdAt').sort({ createdAt: 1 });
       // Kiểm tra nếu không có lịch sử
       if (tasks.length === 0) {
          console.log('Không có lịch sử nào được tìm thấy cho userId:', userId);
          return res.json([]);
      }
      else {
       res.status(200).json(tasks);
       }
    } catch (error) {
       res.status(500).json({ message: 'Lỗi khi lấy danh sách từ server!' });
    }
 });
 
// Thêm lịch sử mới
router.post('/add', async (req, res) => {
   try { 
      let { userId, content } = req.body; 
      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'Người dùng không tồn tại!' });
      }
      const newHistory = new History({
         userId,
         content,
         createdAt
      });
      try {
         const savedHistory = await newHistory.save();  
         res.status(201).json({ message: 'lưu id thành công!', createdAt: savedHistory.createdAt });
         console.log(savedHistory.createdAt);
         // console.log(savedEvent._id);
       } catch (error) {
         console.error('Lỗi khi lưu lịch sử!', error);
         res.status(500).json({ message: 'lưu id thất bại!' });
       }
   } catch (error) {
      res.status(500).json({ message: 'Lỗi thêm lịch sử!' });
   }
});
 module.exports = router;