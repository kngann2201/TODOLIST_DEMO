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
            const list = document.querySelectorAll('#myItem > option')
            const xValues = list;
            var ht = 0, dc = 0, td = 0;
            todos.forEach(task => {
                if (task.filter === "Học tập") ht++;
                else if (task.filter === "Đi chơi") dc++;
                else td++;  
            }); 
            const yValues = [ht, dc, td];
            const barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797"
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
                title: {
                display: true,
                text: "Biểu đồ số lượng từng phân loại nhiệm vụ của bạn"
                }
            }
    });
        } catch (error) {
            alert('Lỗi khi tải nhiệm vụ!!');
        }
    }
    loadTasksForCount();
});