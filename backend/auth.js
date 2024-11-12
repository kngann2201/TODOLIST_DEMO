const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const router = express.Router();

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
   try {
      const { username, password } = req.body;
      // Kiểm tra nếu username đã tồn tại
      const existingUser = await User.findOne({ username });
      if (existingUser) {
         return res.json({ message: 'Tên người dùng đã tồn tại!' });
      }
      const newUser = new User({ username, password});
      await newUser.save();
      res.json({ message: 'Đăng ký thành công!' });
   } catch (error) {
      res.json({ message: 'Lỗi server!' });
   }
});

// Đăng nhập người dùng
router.post('/login', async (req, res) => {
   try {
      const { username, password } = req.body;
      // Kiểm tra thông tin người dùng
      console.log(`Đăng nhập với username: ${username}`);
      // Tìm người dùng theo username
      const user = await User.findOne({ username });
      console.log('Kết quả tìm kiếm người dùng:', user);
      if (!user) {
         return res.json({ message: 'Không tồn tại người dùng này!' });
      }
      // Kiểm tra mật khẩu
      if (password !== user.password) {
         return res.json({ message: 'Sai mật khẩu!' });
      }
      res.json({ message: 'Đăng nhập thành công!', userId: user._id, username: user.username  });
   } catch (error) {
      res.json({ message: 'Lỗi server!' });
   }
});
module.exports = router;
