document.addEventListener('DOMContentLoaded', function() {
  //Welcome
  const name = localStorage.getItem('name');
  const userId = localStorage.getItem('userId');
  const taskId = localStorage.getItem('taskId');
  // const contentId = localStorage.getItem('contentId');
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
    // Lấy danh sách sự kiện từ server
      async function loadTasks() {
        if (!userId) {
            alert('Vui lòng đăng nhập!');
            window.location.href = 'login.html';
            return;
        }
        // console.log('Đang gửi yêu cầu API để tải sự kiện...');  // Kiểm tra 
        try {
            const response = await fetch(`http://localhost:5000/api/diary/list/${userId}`);
            if (!response.ok) {
              throw new Error('Không thể tải sự kiện');
            }
            // console.log('API đã được gửi', response);  // Kiểm tra
            const diaries = await response.json();
            // console.log(diaries)   // Kiểm tra
            const diaryList = document.getElementById('myUL');
            diaryList.innerHTML = ''; 
            diaries.forEach(task => { 
              const dateType = new Date(task.createdAt);
              console.log(dateType.getDate());
              if (dateType.getDate()==d)
              {            
                const li = document.createElement("li");
                var y = document.createElement("SPAN");
                y.className = "headlineDiary";
                y.textContent = task.task;
                li.appendChild(y);
                var z = document.createElement("TEXTAREA");
                z.value= task.content;
                z.className = "contentDiary";
                li.appendChild(z);
                li.dataset.taskId = task._id;
                // li.dataset.contentId = content._id;
                diaryList.appendChild(li);
                addCloseButton(li); 
              }  
            });
        } catch (error) {
            alert('Không có nhật ký nào được tìm thấy, hãy thử ngày khác nhé!');
        }
      }
      loadTasks();
    });
  });

  // // Lấy danh sách sự kiện từ server
  // async function loadTasks() {
  //   if (!userId) {
  //       alert('Vui lòng đăng nhập!');
  //       window.location.href = 'login.html';
  //       return;
  //   }
  //   // console.log('Đang gửi yêu cầu API để tải sự kiện...');  // Kiểm tra 
  //   try {
  //       const response = await fetch(`http://localhost:5000/api/diary/list/${userId}`);
  //       if (!response.ok) {
  //         throw new Error('Không thể tải sự kiện');
  //       }
  //       // console.log('API đã được gửi', response);  // Kiểm tra
  //       const diarys = await response.json();
  //       // console.log(diarys)   // Kiểm tra
  //       const diaryList = document.getElementById('myUL');
  //       diaryList.innerHTML = ''; 
  //       diarys.forEach(task => {
  //           const li = document.createElement("li");
  //           var y = document.createElement("SPAN");
  //           y.className = "headlineDiary";
  //           y.textContent = task.task;
  //           li.appendChild(y);
  //           var z = document.createElement("TEXTAREA");
  //           z.value= task.content;
  //           z.className = "contentDiary";
  //           li.appendChild(z);
  //           li.dataset.taskId = task._id;
  //           // li.dataset.contentId = content._id;
  //           diaryList.appendChild(li);
  //           addCloseButton(li);
  //       });
  //   } catch (error) {
  //       alert('Lỗi khi tải sự kiện!');
  //   }
  // }
  // loadTasks();

  //Tạo phần tử danh sách mới
  const input = document.getElementById('myInput');
  const inputDiary = document.getElementById('myInputDiary');
  const inputDate = document.getElementById('date');
  console.log('id:',userId); //kiểm tra
  function newElement() {
    const inputValue = input.value;
    const inputDiaryValue = inputDiary.value;
    const inputDateValue = inputDate.value;
    const dateType = new Date(inputDateValue);
    console.log('inputValue:', inputValue);
    console.log('inputDate:', inputDateValue);
    console.log('inputDateType:', dateType);
    if (!inputValue) {
      alert("Hãy viết nội dung trước khi thêm nhé!");
      return;
    }
    if (!inputDiaryValue) {
      alert("Hãy viết nội dung trước khi thêm nhé!");
      return;
    }
    if (!inputDateValue) {
      alert("Chọn ngày đã nhé!");
      return;
    }
    const li = document.createElement("li");
    var span = document.createElement("SPAN");
    span.className = "headlineDiary";
    span.textContent = inputValue;
    li.appendChild(span);
    var x = document.createElement("TEXTAREA");
    x.className = "contentDiary";
    x.value = inputDiaryValue;
    li.appendChild(x);
    const list = document.getElementById("myUL");
  // Gửi sự kiện mới lên server để lưu vào MongoDB
    fetch('http://localhost:5000/api/diary/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ userId: userId, task: inputValue, content : inputDiaryValue, createdAt: dateType }) 
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
    inputDiary.value = "";
  }
  // Xử lí "Add" 
  document.getElementById("addButton").addEventListener("click", newElement);
  // Xử lí "Enter" từ bàn phím
  // document.getElementById("myInput").addEventListener("keypress", function(event) {
  //   if (event.key === "Enter") {
  //       newElement();   
  // }});
  // document.getElementById("inputDiaryValue").addEventListener("keypress", function(event) {
  //   if (event.key === "Enter") {
  //       newElement();   
  // }});


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
      fetch(`http://localhost:5000/api/diary/delete/${taskId}`, {
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
  console.log('DOM is ready');
});
