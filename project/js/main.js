

$(function(){
    if($('body').is('#homeBody')){
        handleSignIn();
        dashboard();
    }
  });
$(function(){
    if($('body').is('#planningBody')){
        todoMain();
    }
  });
$(function(){
    if($('body').is('#notesBody')){
        notesMain();
    }
  });
$(function(){
    if($('body').is('#tasksBody')){
        taskPlanning();
    }
  });

  const db = firebase.firestore();


// This is in regards to the sign in method. Only google works for now.
function handleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user.email);
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function notesMain() {
    // This is the NEW notes feature
let notesCollection = document.querySelector("#posts-collection")

function createNote(title, time, content) {
    let div = document.createElement('div');
    div.setAttribute('class', 'col-md-4');

    let h2 = document.createElement('h2');
    let p = document.createElement('p');
    let small = document.createElement('small');

    h2.textContent = title;
    small.textContent = time;
    p.textContent = content;

    div.appendChild(h2);
    div.appendChild(small);
    div.appendChild(p);

    notesCollection.appendChild(div);
}

// Get posts (This is defined previous in commented code)
function getNotes() {
    db.collection("notes").get().then(snapshot => {
        snapshot.docs.forEach(docs => {
            createNote(
                docs.data().noteName,
                docs.data().createdAt,
                docs.data().noteContent
            )
        });
    }).catch(err => {
        console.log(err);
    });
}

getNotes();

document.querySelector('#submitBtn').addEventListener('click', 
function submittingNote() {
    let noteAuthor = document.querySelector('#author').value;
    let noteTitle = document.querySelector('#noteTitle').value;
    let noteContent = document.querySelector('#noteContent').value;
    let noteDate = document.querySelector('#noteDate').value;

    if (
        noteAuthor === '' ||
        noteTitle === '' ||
        noteContent === '' ||
        noteDate === ''
    ) {
        alert('Fields Empty')
    } else {
        db.collection('notes').doc().set({
            author: noteAuthor,
            createdAt: noteDate,
            noteName: noteTitle,
            noteContent: noteContent
        });
    }
});
}

function taskPlanning() {
    const taskInput = document.querySelector('.task-input');
    const taskButton = document.querySelector('.task-button');
    const taskList = document.querySelector('.task-list');
    const filterOption = document.querySelector(".filter-task");

    // Event listeners
    document.addEventListener('DOMContentLoaded', getTasks)
    taskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', deleteCheck);
    filterOption.addEventListener('click', filterTask)


    // Functions

    function addTask(event) {
        // Prevent form from submitting
        event.preventDefault();
        //Todo DIV
        const taskDiv = document.createElement('div');
        taskDiv.classList.add("task");
        //Create li
        const newTask = document.createElement('li');
        newTask.innerText = taskInput.value;
        newTask.classList.add('task-item');
        taskDiv.appendChild(newTask);
        //Add todo to localStorage
        saveLocalTasks(taskInput.value);
        //Check mark button
        const completedButton = document.createElement('button');
        completedButton.innerHTML = '<i class="fas fa-check"></i>';
        completedButton.classList.add("complete-btn");
        taskDiv.appendChild(completedButton);
        //Check trash button
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        taskDiv.appendChild(trashButton);
        //Append to  list
        taskList.appendChild(taskDiv);
        //Clear todo input value
        taskInput.value = "";
    }

    function deleteCheck(e) {
        const item = e.target;
        //Delete
        if (item.classList[0] === "trash-btn") {
            const task = item.parentElement;
            //animation
            task.classList.add("fall");
            removeLocalTasks(task);
            task.addEventListener('transitionend', function () {
                task.remove();
            });
        }

        //Check
        if (item.classList[0] === "complete-btn") {
            const task = item.parentElement;
            task.classList.toggle("completed");
            // removeLocalTasks(task);
        }
    }

    function filterTask(e) {
        const tasks = taskList.childNodes;
        tasks.forEach(function (task) {
            switch (e.target.value) {
                case "all":
                    break;
                case "completed":
                    if (task.classList.contains('completed')) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                    break;
                case "uncompleted":
                    if (!task.classList.contains('completed')) {
                        task.style.display = 'flex';
                    } else {
                        task.style.display = 'none';
                    }
                    break;

            }
        });
    }

    function saveLocalTasks(task) {
        //Check if there are already things in there
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        tasks.push(task);
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    function getTasks() {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        tasks.forEach(function (task) {
            //Task DIV
            const taskDiv = document.createElement('div');
            taskDiv.classList.add("task");
            //Create li
            const newTask = document.createElement('li');
            newTask.innerText = task;
            newTask.classList.add('task-item');
            taskDiv.appendChild(newTask);
            //Check mark button
            const completedButton = document.createElement('button');
            completedButton.innerHTML = '<i class="fas fa-check"></i>';
            completedButton.classList.add("complete-btn");
            taskDiv.appendChild(completedButton);
            //Check trash button
            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';
            trashButton.classList.add("trash-btn");
            taskDiv.appendChild(trashButton);
            //Append to  list
            taskList.appendChild(taskDiv);
        });
    }

    function removeLocalTasks(task) {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        const taskIndex = task.children[0].innerText;
        tasks.splice(todos.indexOf(taskIndex), 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

}

function todoMain() {
    const DEFAULT_OPTION = "All categories";

    let inputElem,
        inputElem2,
        dateInput,
        timeInput,
        addBtn,
        sortBtn,
        selectElem,
        todoList = [],
        // calendar,
        shortlistBtn,
        changeBtn,
        todoTable,
        draggingElem;


    getElements();
    addListeners();
    // initCalendar();
    load();
    renderRows(todoList);
    updateSelectOptions();

    // This is capturing the inputs
    function getElements() {
        inputElem = document.getElementsByTagName
            ("input")[0];
        dateInput = document.getElementById("dateInput");
        timeInput = document.getElementById("timeInput");
        inputElem2 = document.getElementsByTagName("input")[1];
        addBtn = document.getElementById("addBtn");
        sortBtn = document.getElementById("sortBtn");
        selectElem = document.getElementById("categoryFilter");
        shortlistBtn = document.getElementById("shortlistBtn");
        changeBtn = document.getElementById("changeBtn")
        todoTable = document.getElementById("todoTable");
    }

    // This is changing the display
    function addListeners() {
        addBtn.addEventListener("click", addEntry, false);
        sortBtn.addEventListener("click", sortEntry, false);
        selectElem.addEventListener("change", multipleFilter, false);
        shortlistBtn.addEventListener("change", multipleFilter, false);

        document.getElementById("todo-modal-close-btn").addEventListener("click", closeEditModalBox, false);

        changeBtn.addEventListener("click", commitEdit, false);

        todoTable.addEventListener("dragstart", onDragStart, false);
        todoTable.addEventListener("drop", onDrop, false);
        todoTable.addEventListener("dragover", onDragover, false);
    }

    // This is what happens when you click add
    function addEntry(event) {

        let inputValue = inputElem.value;
        inputElem.value = "";

        let inputValue2 = inputElem2.value;
        inputElem2.value = "";

        let dateValue = dateInput.value;
        dateInput.value = "";

        let timeValue = timeInput.value;
        timeInput.value = "";

        let obj = {
            id: _uuid(),
            todo: inputValue,
            category: inputValue2,
            date: dateValue,
            time: timeValue,
            done: false,
        }

        renderRow(obj);

        todoList.push(obj);

        save();

        updateSelectOptions();

    }

    // This update the select menu
    function updateSelectOptions() {
        let options = [];

        todoList.forEach((obj) => {
            options.push(obj.category);
        })

        let optionsSet = new Set(options);

        // All categories select option
        selectElem.innerHTML = "";
        let newOptionElem = document.createElement('option');
        newOptionElem.value = DEFAULT_OPTION;
        newOptionElem.innerText = DEFAULT_OPTION;
        selectElem.appendChild(newOptionElem);

        // options.forEach((option)=>{
        for (let option of optionsSet) {
            let newOptionElem = document.createElement('option');
            newOptionElem.value = option;
            newOptionElem.innerText = option;
            selectElem.appendChild(newOptionElem);
        };
    }

    function save() {
        let stringified = JSON.stringify(todoList);
        localStorage.setItem("todoList", stringified);

        db.collection("notes").get().then(snapshot => {
            snapshot.docs.forEach(docs => {
                createNote(
                    docs.data().noteName,
                    docs.data().createdAt,
                    docs.data().noteContent
                )
            })
        });
    }

    function load() {
        let retrieved = localStorage.getItem("todoList");
        todoList = JSON.parse(retrieved);
        if (todoList == null)
            todoList = [];
    }

    function renderRows(arr) {
        arr.forEach(todoObj => {
            renderRow(todoObj);
        })
    }

    // This is the rendering function to display what you see
    function renderRow({ todo: inputValue, category: inputValue2, id, date, time, done }) {

        // add a new row
        let table = document.getElementById("todoTable");
        let trElem = document.createElement("tr");
        table.appendChild(trElem);
        trElem.draggable = "true"; // this is to add the drag
        trElem.dataset.id = id;

        // checkbox cell
        let checkboxElem = document.createElement("input");
        checkboxElem.type = "checkbox";
        checkboxElem.addEventListener("click", checkboxCallback, false);
        checkboxElem.dataset.id = id;
        let tdElem1 = document.createElement("td");
        tdElem1.appendChild(checkboxElem);
        trElem.appendChild(tdElem1);

        // date cell
        let dateElem = document.createElement("td");

        dateElem.innerText = formatDate(date);
        trElem.appendChild(dateElem);

        // time cell
        let timeElem = document.createElement("td");
        timeElem.innerText = time;
        trElem.appendChild(timeElem);

        // todo cell
        let tdElem2 = document.createElement("td");
        tdElem2.innerText = inputValue;
        trElem.appendChild(tdElem2);

        // category cell
        let tdElem3 = document.createElement("td");
        tdElem3.innerText = inputValue2;
        tdElem3.className = "categoryFilter";
        trElem.appendChild(tdElem3);

        // edit cell
        let editSpan = document.createElement("span");
        editSpan.innerText = "edit";
        editSpan.className = "material-icons";
        editSpan.addEventListener('click', toEditItem, false);
        editSpan.dataset.id = id;
        let editTd = document.createElement("td");
        editTd.appendChild(editSpan);
        trElem.appendChild(editTd);


        // delete cell
        let spanElem = document.createElement("span");
        spanElem.innerText = "delete";
        spanElem.className = "material-icons";
        spanElem.addEventListener('click', deleteItem, false);
        spanElem.dataset.id = id;
        let tdElem4 = document.createElement("td");
        tdElem4.appendChild(spanElem);
        trElem.appendChild(tdElem4);

        // done button
        checkboxElem.type = "checkbox"
        checkboxElem.checked = done;
        if (done) {
            trElem.classList.add("strike");
        } else {
            trElem.classList.remove("strike");
        }

        addEvent({
            id: id,
            title: inputValue,
            start: date,
        });

        dateElem.dataset.type = "date";
        // dateElem.dataset.value = date;
        timeElem.dataset.type = "time";
        tdElem2.dataset.type = "todo";
        tdElem3.dataset.type = "category";

        dateElem.dataset.id = id;
        timeElem.dataset.id = id;
        tdElem2.dataset.id = id;
        tdElem3.dataset.id = id;
        // tdElem2.addEventListener("dblclick", allowEdit, false);

        function deleteItem() {
            trElem.remove();
            updateSelectOptions();

            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id == this.dataset.id)
                    todoList.splice(i, 1);
            }
            save();

            // remove from calendar
            // calendar.getEventById(this.dataset.id)//.remove();

        }

        function checkboxCallback() {
            trElem.classList.toggle("strike");
            for (let i = 0; i < todoList.length; i++) {
                if (todoList[i].id == this.dataset.id)
                    todoList[i]["done"] = this.checked;
            }
            save();
        }

    }

    // This generate a unique id for each data entry
    function _uuid() {
        var d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function sortEntry() {
        todoList.sort((a, b) => {
            let aDate = Date.parse(a.date);
            let bDate = Date.parse(b.date);
            return aDate - bDate;
        });

        save();

        clearTable();

        renderRows(todoList);
    }

    // function initCalendar() {
    //     var calendarEl = document.getElementById('calendar');

    //     calendar = new FullCalendar.Calendar(calendarEl, {
    //         initialView: 'dayGridMonth',
    //         initialDate: Date.now(),
    //         headerToolbar: {
    //             left: 'prev,next today',
    //             center: 'title',
    //             right: 'dayGridMonth,timeGridWeek,timeGridDay'
    //         },
    //         events: [],

    //         eventClick: function (info) {
    //             toEditItem(info.event);
    //         },
    //         eventBackgroundColor: "rgba(139, 78, 63, 1)",
    //         eventBorderColor: "rgba(139, 78, 63, 1)",
    //         editable: true,
    //         eventDrop: function (info){
    //             calendarEventDrag(info.event)
    //         }
    //     });

    //     calendar.render();
    // }

    // function addEvent(event) {
    //     calendar.addEvent(event)
    // }

    function clearTable() {
        // empty the table but keeping the first row.
        let trElems = document.getElementsByTagName("tr");
        for (let i = trElems.length - 1; i > 0; i--) {
            trElems[i].remove();
        }

        // calendar.getEvents().forEach(event => event.remove());
    }

    function multipleFilter() {

        clearTable();

        let selection = selectElem.value;

        if (selection == DEFAULT_OPTION) {

            if (shortlistBtn.checked) {
                let filteredIncompleteArr = todoList.filter(obj => obj.done == false);
                renderRows(filteredIncompleteArr);

                let filteredCompleteArr = todoList.filter(obj => obj.done == true);
                renderRows(filteredCompleteArr);
            } else {
                renderRows(todoList);
            }

        } else {
            let filteredCatArr = todoList.filter(obj => obj.category == selection);

            if (shortlistBtn.checked) {
                let filteredIncompleteArr = filteredCatArr.filter(obj => obj.done == false);
                renderRows(filteredIncompleteArr);

                let filteredCompleteArr = todoList.filter(obj => obj.done == true);
                renderRows(filteredCompleteArr);
            } else {
                renderRows(filteredCatArr);
            }

        }
    }

    function onTableClick(event) {
        if (event.target.matches("td") && event.target.dataset.editable == "true") {
            let tempInput;
            switch (event.target.dataset.type) {
                case "date":
                    tempInput = document.createElement("input");
                    tempInput.type = "date";

                    tempInput.value = event.target.dataset.value;
                    break;
                case "time":
                    tempInput = document.createElement("input");
                    tempInput.type = "time";
                    tempInput.value = event.target.innerText;
                    break;
                case "todo":
                case "category":
                    tempInput = document.createElement("input");
                    tempInput.value = event.target.innerText;
                    break;
                default:
            }
            event.target.innerText = "";
            event.target.appendChild(tempInput);

            tempInput.addEventListener("change", onChange, false);
        }

        function onChange(event) {
            let changedValue = event.target.value;
            let id = event.target.parentNode.dataset.id;
            let type = event.target.parentNode.dataset.type;

            // Remove from calendar
            // calendar.getEventById(id).remove();

            todoList.forEach(todoObj => {
                if (todoObj.id == id) {
                    todoObj[type] = changedValue;

                    addEvent({
                        id: id,
                        title: todoObj.todo,
                        start: todoObj.date,
                    });
                }
            });
            save();


            // if (type == "date") {
            //     event.target.parentNode.innerText = formatDate(changedValue);
            // } else {
            //     event.target.parentNode.innerText = changedValue;
            // }
        }
    }

    function formatDate(date) {
        let dateObj = new Date(date);
        let formatDate = dateObj.toLocaleString("en-gb",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            });
        return formatDate
    }

    function showEditModalBox(event) {
        document.getElementById("todo-overlay").classList.add("slideIntoView")
    }

    function closeEditModalBox(event) {
        document.getElementById("todo-overlay").classList.remove("slideIntoView")
    }

    function commitEdit(event) {
        closeEditModalBox();

        let id = event.target.dataset.id;
        let todo = document.getElementById("todo-edit-todo").value;
        let category = document.getElementById("todo-edit-cat").value;
        let date = document.getElementById("todo-edit-date").value;
        let time = document.getElementById("todo-edit-time").value;

        // Remove from calendar
        // calendar.getEventById(id)//.remove();

        for (let i = 0; i < todoList.length; i++) {
            if (todoList[i].id == id) {
                todoList[i] = {
                    id,
                    todo,
                    category,
                    date,
                    time,
                    done: false,
                };

                addEvent({
                    id: id,
                    title: todoList[i].todo,
                    start: todoList[i].date,
                });
            }
        }

        save();

        // Update the table
        //let tdNodeList = todoTable.querySelectorAll("td[data-id]");
        let tdNodeList = todoTable.querySelectorAll("td[data-id='" + id + "']");

        for (let i = 0; i < tdNodeList.length; i++) {
            //if(tdNodeList[i].dataset.id == id){
            let type = tdNodeList[i].dataset.type;
            switch (type) {
                case "date":
                    tdNodeList[i].innerText = formatDate(date);
                    break;
                case "time":
                    tdNodeList[i].innerText = time;
                    break;
                case "todo":
                    tdNodeList[i].innerText = todo;
                    break;
                case "category":
                    tdNodeList[i].innerText = category;
                    break;
            }
            //}
        }
    }

    function toEditItem(event) {
        showEditModalBox();

        let id;

        if (event.target)
            id = event.target.dataset.id;
        else
            id = event.id;
        preFillEditForm(id);

    }

    function preFillEditForm(id) {
        let result = todoList.find(todoObj => todoObj.id == id);
        let { todo, category, date, time } = result;

        document.getElementById("todo-edit-todo").value = todo;
        document.getElementById("todo-edit-cat").value = category;
        document.getElementById("todo-edit-date").value = date;
        document.getElementById("todo-edit-time").value = time;

        changeBtn.dataset.id = id;
    }

    function onDragStart(event) {
        draggingElem = event.target; //trElem
    }

    function onDrop(event) {

        /* this is drap&drop on the table rows */

        // prevent when the target is table
        if (event.target.matches("table"))
            return;
        let beforeTarget = event.target;

        // include spans and the entire parent
        while (!beforeTarget.matches("tr"))
            beforeTarget = beforeTarget.parentNode;

        // some style to be added    
        //beforeTarget.style.paddingTop = "1rem";

        // prevent error when dropped on heading row
        if (beforeTarget.matches(":first-child"))
            return;

        // this is the visual drag&drop    
        todoTable.insertBefore(draggingElem, beforeTarget);

        /* handling the array */

        let tempIndex;

        // find the index to be taken out
        todoList.forEach( (todoObj, index) => {
            if( todoObj.id == draggingElem.dataset.id)
                tempIndex = index;
        });

        // pop the element
        let [toInsertObj] = todoList.splice(tempIndex, 1);

        // find the index to be inserted before

        todoList.forEach ((todoObj, index) => {
            if( todoObj.id == beforeTarget.dataset.id)
            tempIndex = index;
        })

        //insert the temp
        todoList.splice(tempIndex, 0, toInsertObj);

        // update storage
        save();
    }

    function onDragover(event) {
        event.preventDefault();
    }

    // function calendarEventDrag(event){
    //     let id = event.id;
    //     let dateObj = new Date(event.start);
    //     let year = dateObj.getFullYear();
    //     let month = dateObj.getMonth() + 1;
    //     let date = dateObj.getDate();

    //     let paddMonth = month.toString();
    //     if (paddMonth.length < 2){
    //         paddMonth = "0" + paddMonth;
    //     }
    //     let paddDate = date.toString();
    //     if (paddDate.length < 2){
    //         paddDate = "0" + paddDate;
    //     }
    //     let toStoreDate = `${year}-${paddMonth}-${paddDate}`;
    //     console.log(toStoreDate);

    //     todoList.forEach(todoObj => {
    //         if(todoObj.id == id){
    //             todoObj.date = toStoreDate;
    //         }
    //     });

    //     save();

    //     multipleFilter();
    // }
}

function dashboard() {
    var calendarMain = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarMain, {
        initialView: 'timeGridDay',
        initialDate: Date.now(),
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [],

        eventClick: function (info) {
            toEditItem(info.event);
        },
        eventBackgroundColor: "rgba(139, 78, 63, 1)",
        eventBorderColor: "rgba(139, 78, 63, 1)",
        editable: true,
        eventDrop: function (info){
            calendarEventDrag(info.event)
        }
    });

    calendar.render();
}



