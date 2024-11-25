document.addEventListener('DOMContentLoaded', function () {
    //Welcome
            const name = localStorage.getItem('name');
            const userId = localStorage.getItem('userId');
            const taskId = localStorage.getItem('taskId');
            console.log(name); //kiểm tra
            document.getElementById("name").innerHTML = `${name}`;
    //CHART
    const xValues = ["Học tập", "Đi chơi", "Việc cần làm"];
    var ht = document.querySelectorAll('#myTodo li#study').length;
    var dc = document.querySelectorAll('#myTodo li#goout').length;
    var td = document.querySelectorAll('#myTodo li#hasTodo').length;
    console.log(ht);
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
});