let tasksArray=new Map();//to check with this if a task is repeated or not (map for fast performance)
/////////////////////////////////////////////////////////////////////////////

window.onload = function() {
    getFromDatabase();
};


////////////////////////////delete//////////////////////////////////////////////
function deleteTask(row){
    if(row){
        let taskName = row.cells[0].textContent;
        let keyTask = taskName.toLowerCase().replace(/\s+/g, "");
        let id = tasksArray.get(keyTask);
        if (id) {
            deleteFromDatabase(id);
            tasksArray.delete(keyTask);
            row.remove();
        } else {
            console.log("task not found in map");
        }
    }
    else{
        console.log("Error in receiving the row that will be deleted");
    }
}

function deleteFromDatabase(id){
    request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.status===200 && request.readyState===4){
            console.log("response:"+request.responseText);
        }
    }
    let url="http://localhost/Assignment1/delete.php?id="+id;
    request.open("GET",url,true);
    request.send();
}

/////////////////////////////////////EDIT//////////////////////////////////////
let currentRow = null;

function editTask(row, button) {
    let oldContent = row.cells[0].textContent;

    if (currentRow === null) {
        document.getElementById("task").value = oldContent;
        button.textContent = "Save";
        currentRow = row;
    } else if (currentRow === row) {
        let newTask = document.getElementById("task").value.trim();

        if (newTask == "") {
            alert("Please enter your edited task");
            currentRow = null;
            return;
        }

        if (checkIfExist(newTask)) {
            button.innerHTML = 'Edit <i class="fa-solid fa-pen"></i>';
            document.getElementById("task").value = "";
            alert("This task already exists!");
            currentRow = null;
            return;
        }

        let id = tasksArray.get(oldContent.toLowerCase().replace(/\s+/g, ""));
        tasksArray.delete(oldContent.toLowerCase().replace(/\s+/g, "")); // remove old task
        tasksArray.set(newTask.toLowerCase().replace(/\s+/g, ""), id);  // add new task

        row.cells[0].textContent = newTask;
        button.innerHTML = 'Edit <i class="fa-solid fa-pen"></i>';
        document.getElementById("task").value = "";

        editInDatabase(id, newTask);

        currentRow = null;
    }
}

function editInDatabase(id, taskValue2) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            console.log("Response: " + request.responseText);
        }
    };
    let url = "http://localhost/Assignment1/update.php";
    request.open("POST",url,true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    let data={
        "id":id,
        "task":taskValue2
    }
    request.send(JSON.stringify(data));
}


///////////////////////////////////////////////  Events /////////////////////////
////function to edit and delete a task
function buttonEvents() {
    document.getElementById("tableBody").addEventListener("click", function(e) {
        var button = e.target.closest("button");
        if (!button) return; 

        if (button.classList.contains("del")) {
            var confirmation = confirm("Are you sure you want to delete this task?");
            if (confirmation) {
                deleteTask(button.closest("tr"));
            }
        } 
        else if (button.classList.contains("edit")) {
            editTask(button.closest("tr"),button);
        }
    });

    document.querySelector(".Add").addEventListener("click", function() {
        addTask();
        document.getElementById("task").value = "";
    });
}

//////////////////////////////////////////// check if a task is already existed ///////////////////////////
function checkIfExist(Task){
    Task=Task.toLowerCase().replace(/\s+/g, "");
    if (tasksArray.has(Task)){
        return true;
    }
    else{
        return false;
    }
}

///////////////////////////////////////////////// add task ////////////////////////////////////////
function addTask() {
    var taskValue = document.getElementById("task").value;

    if (!taskValue.trim()) {
        alert("Please Enter your task first");
        return;
    }  

    if (!checkIfExist(taskValue)) { //if the task does not exist

        var tr = document.createElement("tr");

        var tdTask = document.createElement("td");
        tdTask.textContent = taskValue;
        tr.appendChild(tdTask);

        var tdEdit = document.createElement("td");
        tdEdit.innerHTML = '<button class="edit">Edit <i class="fa-solid fa-pen"></i></button>';
        tr.appendChild(tdEdit);

        var tdDelete = document.createElement("td");
        tdDelete.innerHTML = '<button class="del">Delete <i class="fa-solid fa-trash"></i></button>';
        tr.appendChild(tdDelete);

        document.getElementById("tableBody").appendChild(tr);


        storeInDatabase(taskValue);
    }
    else{
        alert("This task is already added!");
    }
}


///////////////////////////////////////to get the data from database /////////////////////

function getFromDatabase() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            try {
                let data = JSON.parse(request.responseText);//response will be JSON so convert to array
                console.log("Tasks from DB: ", data);

                let tableBody = document.getElementById("tableBody");
                tableBody.innerHTML = "";

                data.forEach(task => {
                let row = document.createElement("tr");

                // Task 
                let taskCell = document.createElement("td");
                taskCell.textContent = task.task;
                tasksArray.set(task.task.toLowerCase().replace(/\s+/g, ""),task.id);//reloaded the map that is used avoid multiple tasks added
                row.appendChild(taskCell);

                // Edit button 
                let editCell = document.createElement("td");
                editCell.innerHTML = '<button class="edit">Edit <i class="fa-solid fa-pen"></i></button>';
                row.appendChild(editCell);

                // Delete button
                let deleteCell = document.createElement("td");
                deleteCell.innerHTML = '<button class="del">Delete <i class="fa-solid fa-trash"></i></button>';
                row.appendChild(deleteCell);

                tableBody.appendChild(row);
                });

                buttonEvents(); 
            } catch (err) {
                console.error("Invalid JSON:", request.responseText);
            }
        }
    };

    request.open("GET", "http://localhost/Assignment1/list.php", true);
    request.send();
}


///////////////////////////////////////////database///////////////////////////////
function storeInDatabase(taskValue) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            try {
                let array = JSON.parse(request.responseText);
                console.log("Response: ", array);

                let taskAdded = array['task'];
                let incrementedId = array['id'];
                console.log(incrementedId);

                if (taskAdded && incrementedId) {
                    tasksArray.set(
                        taskAdded.toLowerCase().replace(/\s+/g, ""),
                        incrementedId
                    );
                }
            } catch (err) {
                console.error("Invalid JSON:", request.responseText);
            }
        }
    };

    let url="http://localhost/Assignment1/insert.php";
    request.open("POST", url, true);
    let data={
        "Task":taskValue
    }
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify(data));
}



