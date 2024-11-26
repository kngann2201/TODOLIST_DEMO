document.addEventListener('DOMContentLoaded', function () {
    //Welcome
            const name = localStorage.getItem('name');
            const userId = localStorage.getItem('userId');
            const taskId = localStorage.getItem('taskId');
            console.log(name); //kiểm tra
            document.getElementById("name").innerHTML = `${name}`;
    //CHART
    async function loadTasksForCount() {
        try {
            const response = await fetch(`http://localhost:5000/api/todo/list/${userId}`);
            if (!response.ok) {
              throw new Error('Không thể tải nhiệm vụ');
            }
            // console.log('API đã được gửi', response);  // Kiểm tra
            const todos = await response.json();
            // const list = document.querySelectorAll('#myItem option');
            const xValues = ['Học tập', 'Đi chơi', 'Việc cần làm'];
            // console.log(list);
            var ht = 0, dc = 0, td = 0;
            todos.forEach(task => {
                if (task.filter === "Học tập") ht++;
                else if (task.filter === "Đi chơi") dc++;
                else td++;  
            }); 
            const yValues = [ht, dc, td];
            const barColors = [
            "#F8DAE9",
            "#B9D6F3",
            "#F1E8D9"
            ];
            new Chart("todoChart", {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                backgroundColor: barColors,
                data: yValues
                }]
            },
            options: {
                responsive: true,
                hoverOffset: 20
            }
    })
        } catch (error) {
            alert('Lỗi khi tải nhiệm vụ!!');
        }
    }
    loadTasksForCount();

    //PROGRESS
    async function updateProgress() {
        try {
            const response = await fetch(`http://localhost:5000/api/todo/list/${userId}`);
            if (!response.ok) {
              throw new Error('Không thể tải nhiệm vụ');
            }
            // console.log('API đã được gửi', response);  // Kiểm tra
            const todos = await response.json();
            // const list = document.querySelectorAll('#myItem option');
            const xValues = ['Học tập', 'Đi chơi', 'Việc cần làm'];
            // console.log(list);
            var ht = 0, t = 0;
            todos.forEach(task => {
                // Tính toán phần trăm hoàn thành
                if (task.completed === true) ht++;
                t++;  
            })
            const totalTasks = t;
            const completedCount = ht;
            console.log(t);
            console.log(ht)
            const progressPercentage = (completedCount / totalTasks) * 100;
            const progressBar = document.querySelector('.progressBar');
            progressBar.style.width = progressPercentage + '%';
            const progressText = document.querySelector('.progressText');
            progressText.innerHTML = `Tiến độ hoàn thành các nhiệm vụ: ${progressPercentage}%`;
        } catch (error) {
            alert('Lỗi khi tải nhiệm vụ!!');
        }       
    }
    updateProgress();
    
});