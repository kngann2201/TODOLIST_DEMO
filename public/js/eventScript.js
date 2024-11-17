document.addEventListener('DOMContentLoaded', function() {
    //Welcome
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    const taskId = localStorage.getItem('taskId');
    console.log(name); //kiểm tra
    document.getElementById("name").innerHTML = `${name}`;
    // Lấy danh sách sự kiện từ server
    async function loadTasks() {
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
          const eventList = document.getElementById('myUL');
          eventList.innerHTML = ''; 
          events.forEach(task => {
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
              addCloseButton(li);
          });
      } catch (error) {
          alert('Lỗi khi tải sự kiện!');
      }
    }
    loadTasks();
  
    //Tạo phần tử danh sách mới
    const input = document.getElementById('myInput');
    console.log('id:',userId); //kiểm tra
    function newElement() {
      const inputValue = input.value;
      console.log('inputValue:', inputValue);
      if (!inputValue) {
        alert("Hãy viết nội dung trước khi thêm nhé!");
        return;
      }
      const li = document.createElement("li");
      li.textContent = inputValue;
      const list = document.getElementById("myUL");
      const selectElement = document.getElementById("myItem");
      const choice = selectElement.options[selectElement.selectedIndex].text;
      const choices = selectElement.options[selectElement.selectedIndex].id;
      console.log(choice);
      li.classList.add(choices);
      const selectedDate = document.getElementById('date').value;
    // Gửi sự kiện mới lên server để lưu vào MongoDB
      fetch('http://localhost:5000/api/event/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userId, task: inputValue, completed: false, filter: choice }) 
      })
      .then(response => response.json())
      .then(data => {
          console.log(data.message);
          console.log(data);
          console.log('Thêm sự kiện thành công!');
          li.dataset.taskId = data.taskId;
      })
      .catch(error => {
          console.error('Lỗi khi thêm sự kiện:', error);
      });
      list.insertBefore(li, list.firstChild);
      addCloseButton(li);
      input.value = "";
    }
    // Xử lí "Add" 
    document.getElementById("addButton").addEventListener("click", newElement);
    // Xử lí "Enter" từ bàn phím
    document.getElementById("myInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
          newElement();   
      }
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
    addCloseButton(myNodelist[i]);
    }
  
    //Đánh dấu mục đã hoàn thành 
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
  
    console.log('DOM is ready');
  });
  