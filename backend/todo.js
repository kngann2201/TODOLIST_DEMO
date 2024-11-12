const express = require('express');
const Todo = require('./models/Todo');
const User = require('./models/User');
const mongoose = require('mongoose');
const router = express.Router();

// Lấy danh sách nhiệm vụ của người dùng
router.get('/list/:userId', async (req, res) => {
   try {
      const { userId } = req.params;
      const tasks = await Todo.find({ userId }).select('task completed').sort({ createdAt: -1 });
      // Kiểm tra nếu không có nhiệm vụ
      if (tasks.length === 0) {
         console.log('Không có nhiệm vụ nào được tìm thấy cho userId:', userId);
         return res.json([]);
     }
     else {
      // console.log('Các nhiệm vụ tìm thấy:', tasks);
      res.json(tasks);
      }
   } catch (error) {
      res.json({ message: 'Lỗi khi lấy danh sách từ server!' });
   }
});
// Thêm nhiệm vụ mới
router.post('/add', async (req, res) => {
   try {
      let { userId, task, completed } = req.body;  
      // Kiểm tra người dùng tồn tại
      const user = await User.findById(userId);
      if (!user) {
         return res.json({ message: 'Người dùng không tồn tại!' });
      }
      const newTodo = new Todo({
         userId,
         task,
         completed
      });
      try {
         const savedTodo = await newTodo.save();  
         res.json({ message: 'lưu id thành công!', taskId: savedTodo._id });
         // console.log(savedTodo._id);
       } catch (error) {
         console.error('Lỗi khi lưu nhiệm vụ:', error);
         res.json({ message: 'lưu id thất bại!' });
       }
   } catch (error) {
      res.json({ message: 'Lỗi thêm nhiệm vụ!' });
   }
});
//
//Xóa nhiệm vụ    
router.delete('/delete/:taskId', async (req, res) => {
   // const { taskId } = req.params;
   try {
   const { taskId } = req.params;
   const todo = await Todo.findById(taskId);
   if (!todo) {
      return res.send('Nhiệm vụ không tồn tại');
   }
   // const result = await todo.remove();
   const result = await todo.deleteOne({ _id: taskId }); 
   if (result.deletedCount > 0) {
      res.send('Nhiệm vụ đã được xáo thành công!');
    } else {
      res.status(404).send('Không tìm thấy nhiệm vụ!');
    }
   
   } catch (error) {
     console.error(error);
     res.send('Lỗi server');
   }
 });
 //

// Đánh dấu nhiệm vụ hoàn thành
router.put('/complete/:taskId', async (req, res) => {
   try {
      const { taskId } = req.params;
      const todo = await Todo.findById(taskId);
      if (!todo) {
         return res.json({ message: 'Nhiệm vụ không tồn tại!' });
      }
      todo.completed = req.body.completed;
      await todo.save();
      res.json({ message: 'Nhiệm vụ đã được cập nhật!' });
   } catch (error) {
      res.json({ message: 'Lỗi server!' });
   }
});
module.exports = router;

