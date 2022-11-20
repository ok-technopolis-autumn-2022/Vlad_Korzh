const todoInput = document.querySelector("#search-todos");
const todosCheckList = document.querySelector(".todo-app-checklist");
const filters = document.querySelectorAll(".buttons-filter input");
const clearAll = document.querySelector(".button-clear");
const numberTodos = document.querySelector(".footer-number-remaining-todos");
const selectAll = document.querySelector(".button-down-arrow");
const listKey = "todo-list";
const numKey = "todos-number";
const notification = `<p>
                        <style>
                            p {
                                margin: 15px 0 15px 15px;
                            }
                        </style>
                         You haven't added any tasks
                     </p>`;

var count = getNumberOfTodoFromStorage();
let todos = getListFromStorage();

function showTodoOnPage(filter) {
    createNewTodo(filter);
}

function createNewTodo(filter) {
    let newTask = "";
    if (todos) {
        todos.forEach((task, id) => {
            let isCompleted = task.status;
            if (isCompleted === "completed") {
                isCompleted = "checked";
            } else {
                isCompleted = "";
            }
            if (filter === task.status || filter === "all") {
                newTask += `<div class="section-todos">
                                <label for="${id}">
                                    <input id="${id}" type="checkbox" class="todo-item-status" aria-label="Task: ${task.name}" onclick="updateStatus(this)" ${isCompleted}>
                                    <span class="todo-item-text" ${isCompleted}>${task.name}</span>
                                </label>
                                <button title="Delete this task" aria-label="Delete this task" class="button-delete" onclick="deleteTask(${id})"></button>
                            </div>`;
            }
        });
    }
    todosCheckList.innerHTML = newTask || notification;
    numberTodos.innerHTML = `${count} items left`;
}

showTodoOnPage("all");

function updateStatus(selectedTask) {
    let todoName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        todoName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        todoName.classList.remove("checked");
        todos[selectedTask.id].status = "active";
    }
    localStorage.setItem(listKey, JSON.stringify(todos));
}

function deleteTask(id) {
    todos.splice(id, 1);
    localStorage.setItem(listKey, JSON.stringify(todos));
    decrementCount();
    localStorage.setItem(numKey, count);
    showTodoOnPage("all");
}

function getListFromStorage() {
    const storedList = localStorage.getItem(listKey);
    return storedList ? JSON.parse(storedList) : [];
}

function getNumberOfTodoFromStorage() {
    const number = localStorage.getItem(numKey);
    return number ? JSON.parse(number) : 0;
}

function incrementCount() {
    count++;
}

function decrementCount() {
    count--;
}

filters.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".buttons-filter input:checked").removeAttribute("checked");
        button.classList.add("checked");
        showTodoOnPage(button.id);
    });
});

clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem(listKey, JSON.stringify(todos));
    count = 0;
    localStorage.setItem(numKey, count);
    showTodoOnPage("all");
})

selectAll.addEventListener("click", evt => {
    document.querySelectorAll("input[type=checkbox]").forEach(task => {
        if (!task.checked) {
            todos.forEach(task => task.status = "completed");
            localStorage.setItem(listKey, JSON.stringify(todos));
            showTodoOnPage("all");
        } else {
            todos.forEach(task => task.status = "active");
            localStorage.setItem(listKey, JSON.stringify(todos));
            showTodoOnPage("all");
        }
    });
})

todoInput.addEventListener("keyup", evt => {
    let todo = todoInput.value.trim();
    if (evt.key === "Enter" && todo) {
        if (!todos) {
            todos = [];
        }
        todo.value = "";
        let todoInfo = {
            name: todo,
            status: "active"
        };
        todos.push(todoInfo);
        localStorage.setItem(listKey, JSON.stringify(todos));
        incrementCount();
        localStorage.setItem(numKey, count);
        showTodoOnPage("all");
        todoInput.value = "";
    }
})