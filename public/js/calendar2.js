document.addEventListener('DOMContentLoaded', function () {
        //Welcome
        const name = localStorage.getItem('name');
        const userId = localStorage.getItem('userId');
        const taskId = localStorage.getItem('taskId');
        console.log(name); //kiểm tra
        document.getElementById("name").innerHTML = `${name}`;
        // const selectValue = document.getElementById("myItem").value;
    
         //Lấy ngày được click trên lịch
        const daysli = document.querySelectorAll(".days > li");
        daysli.forEach(day => {
          day.addEventListener('click', function () {
            daysli.forEach(item => item.classList.remove("selectedDay"));
            this.classList.add("selectedDay");
            console.log(this);
            const d = this.innerText;
            console.log(d);
          // Lấy danh sách sự kiện từ server
        // Lấy danh sách sự kiện từ server
        async function loadTasksevent() {
          if (!userId) {
              alert('Vui lòng đăng nhập!');
              window.location.href = 'login.html';
              return;
          }
          // console.log('Đang gửi yêu cầu API để tải sự kiện...');  // Kiểm tra 
          try {
              const response = await fetch(`http://localhost:5000/api/event/list/${userId}`);
              if (!response.ok) {
                throw new Error('Không thể tải sự kiện');
              }
              // console.log('API đã được gửi', response);  // Kiểm tra
              const events = await response.json();
              // console.log(events)   // Kiểm tra
              const eventList = document.getElementById('myEventsUL');
              eventList.innerHTML = ''; 
              events.forEach(task => { 
                const dateType = new Date(task.createdAt);
                if (dateType.getDate()==d)
                {            
                  const li = document.createElement('li');
                  li.textContent = task.task;
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
                  eventList.appendChild(li);
                  addCloseButtonevent(li);
                }   
              });
          } catch (error) {
              alert('Không có sự kiện nào được tìm thấy, hãy thử ngày khác nhé!');
          }
        }
            async function loadTaskstodo() {
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
                    // console.log('API đã được gửi', response);  // Kiểm tra
                    const todos = await response.json();
                    // console.log(todos)   // Kiểm tra
                    const todoList = document.querySelector('.myTodosUL');
                    todoList.innerHTML = ''; 
                    todos.forEach(task => {
                        const dateType = new Date(task.createdAt);
                        if (dateType.getDate()==d)
                        {
                            const li = document.createElement('li');
                            li.textContent = task.task;
                            li.dataset.taskId = task._id;
                            if (task.completed === true) {
                            li.classList.add("completed"); 
                            }
                            // const selectElement = document.getElementById("myItem");
                            // let classF = null;
                            // for (let option of selectElement.options) {
                            // if (option.value === task.filter) {
                            //     classF = option.id; 
                            //     break; 
                            // }
                            // }
                            // li.classList.add(classF);
                            todoList.appendChild(li);
                            addCloseButton(li);
                        }
                    });
                } catch (error) {
                    alert('Lỗi khi tải nhiệm vụ!!');
                }
              }
              loadTasksevent();
              loadTaskstodo();
          });
        });    
 
    //Hàm thêm nút đóng cho một mục danh sách event
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
        fetch(`http://localhost:5000/api/event/delete/${taskId}`, {
            method: 'DELETE'
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Xóa sự kiện thất bại.');
            }
            console.log('sự kiện đã được xóa thành công!'); //history
          })
          .catch(error => console.error('Có lỗi khi xóa sự kiện:', error));
      }
    }
    // Thêm nút xóa vào mỗi mục danh sách hiện có
    var myNodelist = document.getElementsByTagName("LI");
    for (let i = 0; i < myNodelist.length; i++) {
    addCloseButtonevent(myNodelist[i]);
    }
    //Đánh dấu mục đã hoàn thành event
    const todolist = document.getElementById('myEventsUL');
    // console.log(list);
    todolist.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('completed');
    }
    const taskId = ev.target.dataset.taskId;
    const status = ev.target.classList.contains('completed');
    // Cập nhật lại status trên MongoDB
    if (!taskId)
      {
        console.log("Không tìm thấy sự kiện để cập nhật!")
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
          console.log("Cập nhật trạng thái sự kiện thành công!");
      })
      .catch(error => {
        console.error('Lỗi khi cập nhật trạng thái sự kiện:', error);
      });
    }
    }, false);
    
    //Hàm thêm nút đóng cho một mục danh sách todo
      function addCloseButtonevent(li) {
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
      var myNodelist = document.getElementsByTagName("LI");
      for (let i = 0; i < myNodelist.length; i++) {
      addCloseButton(myNodelist[i]);
      }
    
      //Đánh dấu mục đã hoàn thành todo
      const list = document.querySelector('ul');
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

    console.log('DOM is ready');
  });
  