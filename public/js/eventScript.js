const daysTag = document.querySelector(".days");
currentDate = document.querySelector(".current-date");
prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();
prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});
///////////////////////TRANG BÊN DƯỚI
document.addEventListener('DOMContentLoaded', function() {
    //Welcome
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');
    const taskId = localStorage.getItem('taskId');
    console.log(name); //kiểm tra
    document.getElementById("name").innerHTML = `${name}`;

    //Lấy danh sách sự kiện từ server để hiện thị ngay hôm nay khi tải trang
    async function loadTasksDefault() {
      if (!userId) {
          alert('Vui lòng đăng nhập!');
          window.location.href = 'login.html';
          return;
      }
      try {
          const response = await fetch(`http://localhost:5000/api/event/list/${userId}`);
          if (!response.ok) {
            throw new Error('Không thể tải sự kiện');
          }
          const events = await response.json();
          const eventList = document.getElementById('myUL');
          const today = new Date();
          eventList.innerHTML = ''; 
          events.forEach(task => { 
            const dateType = new Date(task.createdAt);
            if (dateType.getDate()===today.getDate())
            {
              const li = document.createElement('li');
              var y = document.createElement("SPAN");
              y.className = "taskToday";
              y.textContent = task.task;
              li.appendChild(y);
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
              eventList.appendChild(li);
              addCloseButton(li); 
            } 
          });
      } catch (error) {
          alert('Không có sự kiện nào được tìm thấy, hãy thử ngày khác nhé!');
      }
    }
    loadTasksDefault();
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
          try {
              const response = await fetch(`http://localhost:5000/api/event/list/${userId}`);
              if (!response.ok) {
                throw new Error('Không thể tải sự kiện');
              }
              const events = await response.json();
              const eventList = document.getElementById('myUL');
              const today = new Date();
              eventList.innerHTML = ''; 
              events.forEach(task => { 
                const dateType = new Date(task.createdAt);
                if (dateType.getDate()==d)
                {            
                  const li = document.createElement('li');
                  var y = document.createElement("SPAN");
                  y.className = "taskToday";
                  y.textContent = task.task;
                  li.appendChild(y);
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
                  eventList.appendChild(li);
                  addCloseButton(li);
                }   
              });
          } catch (error) {
              alert('Không có sự kiện nào được tìm thấy, hãy thử ngày khác nhé!');
          }
        }
        loadTasks();
      });
    });

    //Tạo phần tử danh sách mới
    const input = document.getElementById('myInput');
    const inputDate = document.getElementById('date');
    console.log('id:',userId); //kiểm tra
    function newElement() {
      const inputValue = input.value;
      const inputDateValue = inputDate.value;
      const dateType = new Date(inputDateValue);
      console.log(dateType);
      // const getDate = dateType.getDate(); 
      // const getMonth = dateType.getMonth() + 1;
      // const getYear = dateType.getFullYear();
      // console.log(`Date: ${getDate}, Month: ${getMonth}, Year: ${getYear}`);
      console.log('inputValue:', inputValue);
      if (!inputValue) {
        alert("Hãy viết nội dung trước khi thêm nhé!");
        return;
      }
      if (!inputDateValue) {
        alert("Chọn ngày đã nhé!");
        return;
      }
      const li = document.createElement("li")            
      li.textContent = inputValue;
      const list = document.getElementById("myUL");
      const selectElement = document.getElementById("myItem");
      const choice = selectElement.options[selectElement.selectedIndex].text;
      const choices = selectElement.options[selectElement.selectedIndex].id;
      console.log(choice);
      var x = document.createElement("SPAN");
      x.className = "filterToday";
      x.textContent = choice;
      li.appendChild(x);
      li.classList.add(choices);
    // Gửi sự kiện mới lên server để lưu vào MongoDB
      fetch('http://localhost:5000/api/event/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId: userId, task: inputValue, completed: false, filter: choice, createdAt : dateType })
        // body: JSON.stringify({ userId: userId, task: inputValue, completed: false, filter: choice }) 

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
    const list = document.getElementById('myUL');
    // console.log(list);
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
  