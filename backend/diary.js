const express = require('express');
const Diary = require('./models/Diary');
const User = require('./models/User');
const mongoose = require('mongoose');
const router = express.Router();

// Lấy danh sách sự kiện của người dùng
router.get('/list/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const tasks = await Diary.find({ userId }).select('task content createdAt').sort({ createdAt: 1 });
      // Kiểm tra nếu không có sự kiện
      if (tasks.length === 0) {
         console.log('Không có sự kiện nào được tìm thấy cho userId:', userId);
         return res.json([]);
     }
     else {
      res.status(200).json(tasks);
      }
   } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách từ server!' });
   }
});

// Thêm sự kiện mới
router.post('/add', async (req, res) => {
   try {
      let { userId, task, content, createdAt } = req.body;  
      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'Người dùng không tồn tại!' });
      }
      const newDiary = new Diary({
         userId,
         task,
         content,
         createdAt
      });
      try {
         const savedDiary = await newDiary.save();  
         res.status(201).json({ message: 'lưu id thành công!', taskId: savedDiary._id, date : savedDiary.createdAt });
         // console.log(savedDiary._id);
       } catch (error) {
         console.error('Lỗi khi lưu sự kiện:', error);
         res.status(500).json({ message: 'lưu id thất bại!' });
       }
   } catch (error) {
      res.status(500).json({ message: 'Lỗi thêm sự kiện!' });
   }
});

//Xóa sự kiện    
router.delete('/delete/:taskId', async (req, res) => {
   // const { taskId } = req.params;
   try {
   const { taskId } = req.params;
   const diary = await Diary.findById(taskId);
   if (!diary) {
      return res.status(404).send('sự kiện không tồn tại');
   }
   const result = await diary.deleteOne({ _id: taskId }); 
   if (result.deletedCount > 0) {
      res.status(200).send('sự kiện đã được xóa thành công!');
    } else {
      res.status(404).send('Không tìm thấy sự kiện!');
    }
   
   } catch (error) {
     console.error(error);
     res.status(500).send('Lỗi server');
   }
 });
module.exports = router;

