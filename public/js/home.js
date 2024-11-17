document.addEventListener('DOMContentLoaded', function() {
    //Welcome
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    const taskId = localStorage.getItem('taskId');
    console.log(name); //kiểm tra
    document.getElementById("loginUser").innerHTML = `<span class="username">Chào Mừng ${name}</span>`;
    document.getElementById("name").innerHTML = `${name}`;
    console.log('DOM is ready');
    var start = document.getElementById("start-button");
    start.onclick = function () {
        window.location.href = 'index.html';
    }
});
    