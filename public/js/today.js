document.addEventListener('DOMContentLoaded', async function() {
    //Welcome
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    const taskId = localStorage.getItem('taskId');
    console.log(name); //kiểm tra
    document.getElementById("name").innerHTML = `${name}`;

    //Hàm tạo element 
    const makeElement = function(task, dateType, list, addCloseButton) {
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
      let classF = null;
      li.classList.add(classF);            
      list.appendChild(li);
      if (typeof addCloseButton === "function") {
        addCloseButton(li);
      }
    }
//------------------TODO---------------------------//
    // Lấy danh sách nhiệm vụ từ server
    async function loadTasksTodo(selected = null) {
      if (!userId) {
          alert('Vui lòng đăng nhập!');
          window.location.href = 'login.html';
          return;
      }
      // console.log('Đang gửi yêu cầu API để tải nhiệm vụ...');  // Kiểm tra 
      try {
          const response = await fetch(`http://localhost:5000/api/todo/list/${userId}`);
          if (!response.ok) {
            throw new Error('Không thể tải nhiệm vụ');
          }
          const todos = await response.json();
          const todoList = document.getElementById('myULTodo');
          const today = new Date();
          todoList.innerHTML = ''; 
          todos.forEach(task => {
            const dateType = new Date(task.createdAt);
            if (dateType.getDate() == today.getDate())
            {
              if (!selected || task.filter === selected) {
              makeElement(task, dateType, todoList, addCloseButtonTodo);
              }
            }
          });
      } catch (error) {
          alert("Lỗi hệ thống!")
    }
  }
    loadTasksTodo();
  //Hàm thêm nút đóng cho một mục danh sách
  function addCloseButtonTodo(li) {
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
  var myTodolist = document.querySelectorAll("#myULTodo > li");
  for (let i = 0; i < myTodolist.length; i++) {
  addCloseButtonTodo(myTodolist[i]);
  }

  //Đánh dấu mục đã hoàn thành 
  const listTodo = document.getElementById('myULTodo');
  listTodo.addEventListener('click', function(ev) {
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

//------------------EVENT---------------------------//
    // Lấy danh sách nhiệm vụ từ server
    async function loadTasksEvent(selected = null) {
      if (!userId) {
          alert('Vui lòng đăng nhập!');
          window.location.href = 'login.html';
          return;
      }
      try {
          const response = await fetch(`http://localhost:5000/api/event/list/${userId}`);
          if (!response.ok) {
            throw new Error('Không thể tải nhiệm vụ');
          }
          const events = await response.json();
          const eventList = document.getElementById('myULEvent');
          const today = new Date();
          eventList.innerHTML = ''; 
          events.forEach(task => {
            const dateType = new Date(task.createdAt);
            if (dateType.getDate() == today.getDate())
            {
              if (!selected || task.filter === selected) {
                makeElement(task, dateType, eventList, addCloseButtonEvent);
              }
            }
          });
      } catch (error) {
          alert("Lỗi hệ thống!")
    }
  }
    loadTasksEvent();
  //Hàm thêm nút đóng cho một mục danh sách
  function addCloseButtonEvent(li) {
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
      fetch(`http://localhost:5000/api/event/delete/${taskId}`, {
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
  var myEventlist = document.querySelectorAll("#myULEvent > li");
  for (let i = 0; i < myEventlist.length; i++) {
  addCloseButtonEvent(myEventlist[i]);
  }

  //Đánh dấu mục đã hoàn thành 
  const listEvent = document.getElementById('myULEvent');
  listEvent.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('completed');
  }
  const taskId = ev.target.dataset.taskId;
  const status = ev.target.classList.contains('completed');
  // Cập nhật lại status trên MongoDB
  if (!taskId)
    {
      console.log("Không tìm thấy nhiệm vụ để cập nhật!")
      return;
    } 
    else {
    fetch(`http://localhost:5000/api/event/complete/${taskId}`, {
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

  //Gắn sự kiện cho thẻ select
  selectElement.addEventListener('change', async function () {
    const selected = selectElement.value; 
    await loadTasksTodo(selected);
    await loadTasksEvent(selected); 
});

  

})
    

  