document.addEventListener('DOMContentLoaded', function() {
  //Welcome
  const name = localStorage.getItem('name');
  const userId = localStorage.getItem('userId');
  const taskId = localStorage.getItem('taskId');
  console.log(name); //kiểm tra
  document.getElementById("name").innerHTML = `${name}`;
  // document.getElementById("loginUser").innerHTML = `Chào mừng <span class="username">${name}</span>, hãy lập To-do list ngày hôm nay nhé!`;
  // Lấy danh sách nhiệm vụ từ server
  async function loadTasks() {
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
        const todoList = document.getElementById('myUL');
        todoList.innerHTML = ''; 
        todos.forEach(task => {
            const dateType = new Date(task.createdAt);
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
            // const selectElement = document.getElementById("myItem");
            // let classF = null;
            // for (let option of selectElement.options) {
            //   if (option.value === task.filter) {
            //       classF = option.id; 
            //       break; 
            //   }
            // }
            // li.classList.add(classF);
            todoList.appendChild(li);
            addCloseButton(li);
        });
    } catch (error) {
        alert('Lỗi khi tải nhiệm vụ!!');
    }
  }
  loadTasks();

  //Tạo phần tử danh sách mới
  const input = document.getElementById('myInput');
  const inputDate = document.getElementById('date');
  console.log('id:',userId); //kiểm tra
  function newElement() {
    const inputValue = input.value;
    const inputDateValue = inputDate.value;
    const dateType = new Date(inputDateValue);
    ///////////////
    const label = document.getElementById("myItem").value;
    console.log(label);
    //////////////////////////
    if (!inputValue) {
      alert("Hãy viết nội dung trước khi thêm nhé!");
      return;
    }
    if (!inputDateValue) {
      alert("Chọn ngày đã nhé!");
      return;
    }
    const li = document.createElement("li");
    const list = document.getElementById("myUL");
    // const selectElement = document.getElementById("myItem");
    // const choice = selectElement.options[selectElement.selectedIndex].text;
    // const choices = selectElement.options[selectElement.selectedIndex].id;
    // console.log(choice);
    var z = document.createElement("SPAN");
      z.className = "taskToday";
      z.textContent = inputValue;
      li.appendChild(z);
    var x = document.createElement("SPAN");
      x.className = "dateToday";
      x.textContent = dateType.getDate() + '/' + (dateType.getMonth() + 1);
      li.appendChild(x);
    var y = document.createElement("SPAN");
      y.className = "filterToday";
      // y.textContent = choice;
      y.textContent = label;
      li.appendChild(y);
    // li.classList.add(choices);
  // Gửi nhiệm vụ mới lên server để lưu vào MongoDB
    fetch('http://localhost:5000/api/todo/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ userId: userId, task: inputValue, completed: false, filter: label, createdAt: dateType }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        console.log(data);
        console.log('Thêm nhiệm vụ thành công!');
        li.dataset.taskId = data.taskId;
      // --------------------------------------------
      fetch('http://localhost:5000/api/label/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userId, label: label })
      })
      .then(response => response.json())
      .then(
          console.log('Thêm nhãn thành công!'))
      .catch(error => {
          console.error('Lỗi khi thêm nhãn', error);
      });
      // --------------------------------------------
      const success = "Thêm nhiệm vụ thành công!";
      fetch('http://localhost:5000/api/history/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userId, content: success })
      })
      .then(response => response.json())
      .then(
          console.log('Thêm lịch sử thành công!'))
      .catch(error => {
          console.error('Lỗi khi thêm lịch sử:', error);
          const fail = "Thêm nhiệm vụ thất bại!";
          fetch('http://localhost:5000/api/history/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: userId, content: fail })
          })
      });
      // --------------------------------------------
    })
    .catch(error => {
        console.error('Lỗi khi thêm nhiệm vụ:', error);
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
      fetch(`http://localhost:5000/api/todo/delete/${taskId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Xóa nhiệm vụ thất bại.');
          }
          console.log('Nhiệm vụ đã được xóa thành công!'); //history
        // --------------------------------------------
      const success = "Xóa nhiệm vụ thành công!";
      fetch('http://localhost:5000/api/history/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userId, content: success })
      })
      .then(response => response.json())
      .then(
          console.log('Thêm lịch sử thành công!'))
      .catch(error => {
          console.error('Lỗi khi thêm lịch sử:', error);
          const fail = "Xóa nhiệm vụ thất bại!";
          fetch('http://localhost:5000/api/history/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: userId, content: fail })
          })
      });
      // --------------------------------------------
        })
        .catch(error => 
          {console.error('Có lỗi khi xóa nhiệm vụ:', error)
    });
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
       // --------------------------------------------
      const success = "Cập nhật trạng thái nhiệm vụ thành công!";
      fetch('http://localhost:5000/api/history/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userId, content: success })
      })
      .then(response => response.json())
      .then(
          console.log('Thêm lịch sử thành công!'))
      .catch(error => {
          console.error('Lỗi khi thêm lịch sử:', error);
          const fail = "Cập nhật trạng thái nhiệm vụ thất bại!";
          fetch('http://localhost:5000/api/history/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: userId, content: fail })
          })
      });
      // --------------------------------------------
    })
    .catch(error => {
      console.error('Lỗi khi cập nhật trạng thái nhiệm vụ:', error);
    });
  }
  }, false);

  console.log('DOM is ready');
});
