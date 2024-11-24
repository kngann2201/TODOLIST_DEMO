document.addEventListener('DOMContentLoaded', function () {
  //Welcome
  const name = localStorage.getItem('name');
  const userId = localStorage.getItem('userId');
  const taskId = localStorage.getItem('taskId');
  console.log(name); //kiểm tra
  document.getElementById("name").innerHTML = `${name}`;

  //Lấy ngày được click trên lịch
  const daysli = document.querySelectorAll(".days > li");
  daysli.forEach(day => {
    day.addEventListener('click', function () {
      daysli.forEach(item => item.classList.remove("selectedDay"));
      this.classList.add("selectedDay");
      console.log(this);
      const d = this.innerText;
      console.log(d);
      // Lấy danh sách nhiệm vụ từ server
      async function loadTasks() {
        if (!userId) {
          alert('Vui lòng đăng nhập!');
            window.location.href = 'login.html';
            return;
        }
        try {
          const response = await fetch(`http://localhost:5000/api/todo/list/${userId}`);
          if (!response.ok) {
            throw new Error('Không thể tải nhiệm vụ');
          }
          const todos = await response.json();
          const todoList = document.getElementById('myULTodo');
          console.log(todoList);
          todoList.innerHTML = ''; 
          todos.forEach(task => {
            const dateType = new Date(task.createdAt);
            const today = new Date();

            if (dateType.getDate()==d)
            { 
              //Lấy option được click trong myItem
              const selection = document.getElementById('myItem');
              const myOption = document.querySelectorAll('#myItem>option');
              console.log(myOption);
              //Tạo element theo điều kiện bọc nó
              const li = document.createElement('li');
              var y = document.createElement("SPAN");
              y.className = "taskToday";
              y.textContent = task.task;
                li.appendChild(y);
              var z = document.createElement("SPAN");
              z.className = "dateToday";
              z.textContent = dateType.getDate() + '/' + (dateType.getMonth() +1);
                li.appendChild(z);
              var u = document.createElement("SPAN");
              u.className = "filterToday";
              u.textContent = task.filter;
              li.appendChild(u);
              li.dataset.taskId = task._id;
              if (task.completed === true) {
                li.classList.add("completed"); 
              }
              const selectElement = document.getElementById("myItem");
              let classF = null;
              for (let option of selectElement.options) {
                if (option.value === task.filter) {
                  classF = option.id; 
                  break; 
                }
              }
              li.classList.add(classF);
              todoList.appendChild(li);
              addCloseButton(li);
            }
          });
        } catch (error) {
          alert('Lỗi khi tải nhiệm vụ!!');
        }
      }
      loadTasks();
    });
  });

  //Hàm thêm nút đóng cho một mục danh sách
  function addCloseButton(li) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    //Xóa trên html  
    span.onclick = function() {
      var delspan = this.parentElement;
      const taskId = span.parentElement.dataset.taskId;
      console.log(taskId);
      delspan.remove();
      //Gửi yêu cầu xóa đến MongoDB
      fetch(`http://localhost:5000/api/todo/delete/${taskId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Xóa nhiệm vụ thất bại.');
          }
          console.log('Nhiệm vụ đã được xóa thành công!'); //history
        })
        .catch(error => console.error('Có lỗi khi xóa nhiệm vụ:', error));
    }
  }
  // Thêm nút xóa vào mỗi mục danh sách hiện có
  var myNodelist = document.querySelectorAll('myULTodo > li');
  for (let i = 0; i < myNodelist.length; i++) {
  addCloseButton(myNodelist[i]);
  }

  //Đánh dấu mục đã hoàn thành 
  const list = document.getElementById('myULTodo');
  list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('completed');
  }
  const taskId = ev.target.dataset.taskId;
  // console.log(taskId);
  const status = ev.target.classList.contains('completed');
  // console.log(status); //kiểm tra
  // Cập nhật lại status trên MongoDB
  if (!taskId)
    {
      console.log("Không tìm thấy nhiệm vụ để cập nhật!")
      return;
    } 
    else {
      fetch(`http://localhost:5000/api/todo/complete/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: status }) 
      })
      .then(response => response.json())
      .then(data => {
          console.log(data.message); 
          console.log("Cập nhật trạng thái nhiệm vụ thành công!");
      })
      .catch(error => {
        console.error('Lỗi khi cập nhật trạng thái nhiệm vụ:', error);
      });
    }
  }, false);
});


        

  