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
            const dateType = new Date(task.createdAt);
            console.log(task.content);
            console.log(today);

            // var localNow = new Date( task.createdAt.getTime() -  ( record.offset * 70000 ) );
            // console.log(hours + ":" + minutes + ":" + seconds);
            //   if (dateType.getDate()==today.getDate())
            //   {            
                const li = document.createElement('li');
                li.textContent = task.content;
                // li.textContent = task.content + " lúc " +  localNow.getHours() + ':' + localNow.getMinutes() + ':' + localNow.getSeconds();
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