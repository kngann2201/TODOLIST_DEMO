document.addEventListener('DOMContentLoaded', function() {
// Xử lý đăng ký người dùng
const registerForm = document.getElementById('registerForm');
if (registerForm) {
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-pasword').value;
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Đăng ký thành công!');
            window.location.href = 'login.html'; 
        } else {
            alert(data.message || 'Đã có lỗi xảy ra.');
        }
    } catch (error) {
        alert('Lỗi kết nối!');
    }
});
}

// Xử lý đăng nhập người dùng
const loginForm = document.getElementById('loginForm');
if (loginForm) {
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("test")
            alert('Đăng nhập thành công!');
            // Lưu trữ userId để sử dụng cho To-Do List
            localStorage.setItem('userId', data.userId);
            window.location.href = 'index.html'; 
        } else {
            alert(data.message || 'Đã có lỗi xảy ra.');
        }
    } catch (error) {
        alert('Lỗi kết nối!');
    }
});
}
});