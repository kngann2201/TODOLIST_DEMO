document.addEventListener('DOMContentLoaded', function() {
    //Welcome
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    console.log(name); //kiểm tra
    document.getElementById("name").innerHTML = `${name}`;

    //Lấy danh sách lịch sử 
    async function loadTasks() {
        if (!userId) {
            alert('Vui lòng đăng nhập!');
            window.location.href = 'login.html';
            return;
        }
        try {
            const response = await fetch(`http://localhost:5000/api/history/list/${userId}`);
            if (!response.ok) {
              throw new Error('Không thể tải lịch sử');
            }
            const histories = await response.json();
            const historyList = document.getElementById('cache');
            const today = new Date();
            historyList.innerHTML = ''; 
            histories.forEach(task => { 
            let dateType = new Date(task.createdAt);
            // console.log(task.userId);
            // console.log(task.content);
            // console.log(dateType);
                const li = document.createElement('li');
                var y = document.createElement("SPAN");
                y.className = "contentHistory";
                y.textContent =  task.content;
                li.appendChild(y);
                var z = document.createElement("SPAN");
                z.className = "timeHistory";
                z.textContent = " lúc " +  dateType.getHours() + ':' + dateType.getMinutes() + ':' + dateType.getSeconds();
                li.appendChild(z);
                var u = document.createElement("SPAN");
                u.className = "dateHistory";
                u.textContent = dateType.getDate() + '/' + (dateType.getMonth() +1)+ '/'+dateType.getFullYear();
                li.appendChild(u);
                historyList.appendChild(li);
            //   }   
            });
        } catch (error) {
            alert('Không có lịch sử nào được tìm thấy!');
        }
      }
      loadTasks();  
    console.log('DOM is ready');
  });