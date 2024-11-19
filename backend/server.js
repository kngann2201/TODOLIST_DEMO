const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
// const cors = require('cors');
const app = express();

// Cấu hình Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/demo', { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("Kết nối MongoDB thành công!"))
   .catch(err => console.error("Không thể kết nối MongoDB:", err));
   
// // Sử dụng CORS (Cross-Origin Resource Sharing)
// app.use(cors())

// Cấu hình Express để phục vụ các file tĩnh (html,css,js)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route cho trang đăng ký
app.get('/register.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'register.html'));
});

// Route cho trang đăng nhập
app.get('/login.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'login.html'));
});

// Route cho trang chính (index)
app.get('/index.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
});

// Route cho trang chủ
app.get('/home.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'home.html'));
});

// Route cho trang lịch
app.get('/calendar.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'calendar.html'));
});

// Route cho trang sự kiện
app.get('/event.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'event.html'));
});

// Route cho trang nhật kí
app.get('/diary.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'diary.html'));
});

// Route cho trang start
app.get('/start.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'start.html'));
});

// Route cho trang today list
app.get('/today.html', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'today.html'));
});

// Cấu hình route chính để hiển thị khi truy cập vào localhost:5000
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'public', 'html', 'start.html'));
});

//Kết nối auth.js với server.js để sử dụng các routes đăng kí và đăng nhập
const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

//Kết nối todo.js với server.js để sử dụng các routes tương tác nhiệm vụ
const todoRoutes = require('./todo');
app.use('/api/todo', todoRoutes);

//Kết nối event.js với server.js để sử dụng các routes tương tác nhiệm vụ
const eventRoutes = require('./event');
app.use('/api/event', eventRoutes);

//Kết nối diary.js với server.js để sử dụng các routes tương tác nhiệm vụ
const diaryRoutes = require('./diary');
app.use('/api/diary', diaryRoutes);

// Thiết lập server lắng nghe tại cổng 5000
const PORT = 5000;
app.listen(PORT, () => {
   console.log(`Server đang chạy tại http://localhost:${PORT}`);
});




