const express = require('express');
const Todo = require('./models/Diary');
const User = require('./models/User');
const mongoose = require('mongoose');
const router = express.Router();

// Lấy danh sách nhật kí của người dùng
router.get('/list/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const tasks = await Todo.find({ userId }).select('task completed filter').sort({ createdAt: -1 });
      // Kiểm tra nếu không có nhật kí
      if (tasks.length === 0) {
         console.log('Không có nhật kí nào được tìm thấy cho userId:', userId);
         return res.json([]);
     }
     else {
      res.status(200).json(tasks);
      }
   } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách từ server!' });
   }
});

// Thêm nhật kí mới
router.post('/add', async (req, res) => {
   try {
      let { userId, task, completed, filter } = req.body;  
      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: 'Người dùng không tồn tại!' });
      }
      const newTodo = new Todo({
         userId,
         task,
         completed, 
         filter
      });
      try {
         const savedTodo = await newTodo.save();  
         res.status(201).json({ message: 'lưu id thành công!', taskId: savedTodo._id });
         // console.log(savedTodo._id);
       } catch (error) {
         console.error('Lỗi khi lưu nhật kí:', error);
         res.status(500).json({ message: 'lưu id thất bại!' });
       }
   } catch (error) {
      res.status(500).json({ message: 'Lỗi thêm nhật kí!' });
   }
});

//Xóa nhật kí    
router.delete('/delete/:taskId', async (req, res) => {
   // const { taskId } = req.params;
   try {
   const { taskId } = req.params;
   const todo = await Todo.findById(taskId);
   if (!todo) {
      return res.status(404).send('nhật kí không tồn tại');
   }
   // const result = await todo.remove();
   const result = await todo.deleteOne({ _id: taskId }); 
   if (result.deletedCount > 0) {
      res.status(200).send('nhật kí đã được xóa thành công!');
    } else {
      res.status(404).send('Không tìm thấy nhật kí!');
    }
   
   } catch (error) {
     console.error(error);
     res.status(500).send('Lỗi server');
   }
 });

// Đánh dấu nhật kí hoàn thành
router.put('/complete/:taskId', async (req, res) => {
   try {
      const { taskId } = req.params;
      const todo = await Todo.findById(taskId);
      if (!todo) {
         return res.status(404).json({ message: 'nhật kí không tồn tại!' });
      }
      todo.completed = req.body.completed;
      await todo.save();
      res.status(200).json({ message: 'nhật kí đã được cập nhật!' });
   } catch (error) {
      res.status(500).json({ message: 'Lỗi server!' });
   }
});
module.exports = router;

