const express = require('express');
const mongoose = require('mongoose');
const Label = require('./models/Label');
const User = require('./models/User');
const router = express.Router();

//Lấy danh sách 
router.get('/list/:userId', async (req, res) => {
    try {
       const { userId } = req.params;
       const tasks = await Label.find({ userId }).select('label group');
       // Kiểm tra nếu không có label
       if (tasks.length === 0) {
          console.log('Không có nhãn nào được tìm thấy cho userId:', userId);
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
      let { userId, label } = req.body; 
      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'Người dùng không tồn tại!' });
      }
      const newLabel = new Label({
         userId,
         label
      });
      try {
         const savedLabel = await newLabel.save();  
         res.status(201).json({ message: 'lưu id thành công!' });
       } catch (error) {
         console.error('Lỗi khi lưu nhãn!', error);
         res.status(500).json({ message: 'lưu id thất bại!' });
       }
   } catch (error) {
      res.status(500).json({ message: 'Lỗi thêm nhãn!' });
   }
});
module.exports = router;