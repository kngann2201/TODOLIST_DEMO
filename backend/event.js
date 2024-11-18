const express = require('express');
const Event = require('./models/Event');
const User = require('./models/User');
const mongoose = require('mongoose');
const router = express.Router();

// Lấy danh sách sự kiện của người dùng
router.get('/list/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const tasks = await Event.find({ userId }).select('task completed filter').sort({ createdAt: -1 });
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
      // let { userId, task, completed, filter } = req.body;  
      let { userId, task, completed, filter, createdAt } = req.body; 
      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'Người dùng không tồn tại!' });
      }
      const newEvent = new Event({
         userId,
         task,
         completed, 
         filter,
         createdAt
      });
      try {
         const savedEvent = await newEvent.save();  
         res.status(201).json({ message: 'lưu id thành công!', taskId: savedEvent._id, date : savedEvent.createdAt });
         // console.log(savedEvent._id);
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
   const event = await Event.findById(taskId);
   if (!event) {
      return res.status(404).send('sự kiện không tồn tại');
   }
   const result = await event.deleteOne({ _id: taskId }); 
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

// Đánh dấu sự kiện hoàn thành
router.put('/complete/:taskId', async (req, res) => {
   try {
      const { taskId } = req.params;
      const event = await Event.findById(taskId);
      if (!event) {
         return res.status(404).json({ message: 'sự kiện không tồn tại!' });
      }
      event.completed = req.body.completed;
      await event.save();
      res.status(200).json({ message: 'sự kiện đã được cập nhật!' });
   } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' });
   }
});
module.exports = router;

