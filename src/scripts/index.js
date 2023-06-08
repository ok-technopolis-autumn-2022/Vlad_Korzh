// Ожидаем загрузку DOM-дерева
document.addEventListener("DOMContentLoaded", function () {
        // Получаем ссылки на элементы DOM
        const todoForm = document.querySelector(".todo-form");
        const todoInput = document.querySelector("#input_todo");
        const todoList = document.querySelector(".todo-app-checklist");
        const filterButtons = document.querySelectorAll('input[name="filter"]');
        const clearButton = document.querySelector(".button-clear");

        // Слушатель события отправки формы
        todoForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Отменяем обычное поведение формы

            const todoText = todoInput.value.trim(); // Получаем введенный текст задачи

            if (todoText !== "") {
                // Создаем объект задачи
                const todoItem = {
                    id: Date.now(),
                    text: todoText,
                    completed: false
                };

                // Получаем текущие задачи из LocalStorage (если они есть)
                let todos = JSON.parse(localStorage.getItem("todos")) || [];

                // Добавляем новую задачу в список задач
                todos.push(todoItem);

                // Сохраняем обновленный список задач в LocalStorage
                localStorage.setItem("todos", JSON.stringify(todos));

                // Очищаем поле ввода задачи
                todoInput.value = "";

                // Обновляем отображение списка задач
                displayTodos(todos);
            }
        });

        // Слушатель события клика на кнопке "Select all tasks"
        const selectAllButton = document.querySelector(".button-down-arrow");
        selectAllButton.addEventListener("click", function () {
            const todos = JSON.parse(localStorage.getItem("todos")) || [];

            // Проверяем, есть ли хотя бы одна незавершенная задача
            const hasIncompleteTasks = todos.some(todo => !todo.completed);

            // Если есть незавершенные задачи, то помечаем их все как выполненные,
            // иначе снимаем отметку выполнения со всех задач
            const updatedTodos = todos.map(todo => ({
                ...todo,
                completed: hasIncompleteTasks
            }));

            // Сохраняем обновленный список задач в LocalStorage
            localStorage.setItem("todos", JSON.stringify(updatedTodos));

            // Обновляем отображение списка задач
            displayTodos(updatedTodos);
        });

        // Слушатель события клика на кнопке "Clear completed"
        clearButton.addEventListener("click", function () {
            let todos = JSON.parse(localStorage.getItem("todos")) || [];

            // Фильтруем только незавершенные задачи
            todos = todos.filter(todo => !todo.completed);

            // Сохраняем обновленный список задач в LocalStorage
            localStorage.setItem("todos", JSON.stringify(todos));

            // Обновляем отображение списка задач
            displayTodos(todos);
        });

        // Слушатель события изменения фильтра задач
        filterButtons.forEach(button => {
            button.addEventListener("change", function () {
                let todos = JSON.parse(localStorage.getItem("todos")) || [];

                if (this.id === "active") {
                    // Отображаем только незавершенные задачи
                    todos = todos.filter(todo => !todo.completed);
                } else if (this.id === "completed") {
                    // Отображаем только выполненные задачи
                    todos = todos.filter(todo => todo.completed);
                }

                // Обновляем отображение списка задач
                displayTodos(todos);
            });
        });

        // Функция для отображения списка задач
        function displayTodos(todos) {
            // Очищаем текущий список задач
            todoList.innerHTML = "";

            if (todos.length === 0) {
                // Создаем элемент уведомления
                const notification = document.createElement("p");
                notification.innerText = "You haven't added and completed any tasks";
                todoList.appendChild(notification);
            } else {
                // Создаем элементы задач и добавляем их в список
                todos.forEach(todo => {
                    const todoItem = document.createElement("div");
                    todoItem.classList.add("section-todos");

                    // Создаем элементы для отображения статуса и текста задачи
                    const todoStatus = document.createElement("input");
                    todoStatus.type = "checkbox";
                    todoStatus.classList.add("todo-item-status");
                    todoStatus.checked = todo.completed;
                    todoStatus.addEventListener("change", function () {
                        todo.completed = !todo.completed;

                        // Сохраняем обновленный список задач в LocalStorage
                        localStorage.setItem("todos", JSON.stringify(todos));

                        // Обновляем отображение списка задач
                        displayTodos(todos);
                    });

                    const todoText = document.createElement("p");
                    todoText.classList.add("todo-item-text");
                    todoText.textContent = todo.text;

                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("button-delete");
                    deleteButton.addEventListener("click", function () {
                        // Удаляем задачу из списка
                        todos = todos.filter(item => item.id !== todo.id);

                        // Сохраняем обновленный список задач в LocalStorage
                        localStorage.setItem("todos", JSON.stringify(todos));

                        // Обновляем отображение списка задач
                        displayTodos(todos);
                    });

                    // Добавляем созданные элементы в элемент задачи
                    todoItem.appendChild(todoStatus);
                    todoItem.appendChild(todoText);
                    todoItem.appendChild(deleteButton);

                    // Добавляем элемент задачи в список задач
                    todoList.appendChild(todoItem);
                });

                // Обновляем количество оставшихся задач
                updateRemainingTodosCount(todos);
            }
        }

        // Функция для обновления количества оставшихся задач
        function updateRemainingTodosCount(todos) {
            const remainingTodos = todos.filter(todo => !todo.completed);
            const remainingCount = remainingTodos.length;

            const footerNumberRemainingTodos = document.querySelector(
                ".footer-number-remaining-todos"
            );
            footerNumberRemainingTodos.textContent =
                remainingCount > 1
                    ? `${remainingCount} tasks left`
                    : `${remainingCount} task left`;
        }

        // Получаем список задач из LocalStorage и отображаем его
        const todos = JSON.parse(localStorage.getItem("todos")) || [];
        displayTodos(todos);
    }
);
