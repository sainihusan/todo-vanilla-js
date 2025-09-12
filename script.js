// DOM Elements
const input = document.getElementById('todo-input');
const ul = document.getElementById('todoList');
const button = document.getElementById('add-btn');
const form = document.getElementById('todo-form');
const countdisplay = document.getElementById('task-count');
const clearAllBtn = document.getElementById('clear-all-btn');
const errorDisplay = document.getElementById('error-display');

let todoItems = [];
let currentFilter = "all"; // default

// Initialize app
const init = () => {
  todoItems = getTodos();
  const savedFilter = localStorage.getItem("currentFilter") || "all";
  applyFilter(savedFilter);
};

// Get todos from localStorage
const getTodos = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

// Save todos to localStorage
const addTodos = (tasks) => {
  localStorage.setItem("todos", JSON.stringify(tasks));
};

// Add new task
form.addEventListener('submit', function (e) {
  e.preventDefault();
  addTask();
  taskCounter();
});

function addTask() {
  if (input.value.trim().length !== 0) {
    const uuid = guidGenerator();
    const inputValue = input.value.trim();
    const newTodo = { id: uuid, task: inputValue, completed: false };
    todoItems.push(newTodo);
    addTodos(todoItems);
    input.value = "";
    applyFilter(currentFilter);
  } else {
    errorDisplay.textContent = "Please enter a task.";
    setTimeout(() => errorDisplay.textContent = "", 2000);
  }
}

// Generate unique ID
function guidGenerator() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

// Render buttons + checkbox inside <li>
const renderButtons = (li) => {
  const todoId = li.id;
  const todo = todoItems.find(item => item.id === todoId);

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    todo.completed = checkbox.checked;
    addTodos(todoItems);
    applyFilter(currentFilter);
    taskCounter();
  });
  li.insertBefore(checkbox, li.firstChild);

  // Buttons container
  const div = document.createElement('div');
  div.className = "btn-container";

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = "delete-btn";

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.className = "edit-btn";

  div.appendChild(deleteButton);
  div.appendChild(editButton);
  li.appendChild(div);

  // Delete task
  deleteButton.addEventListener('click', () => {
    li.remove();
    todoItems = todoItems.filter(item => item.id !== todoId);
    addTodos(todoItems);
    taskCounter();
  });

  // Edit task
  editButton.addEventListener('click', () => handleEdit(li, editButton));
};

// Handle editing tasks
const handleEdit = (li, editButton) => {
  const taskSpan = li.querySelector('.task-text');
  const todo = todoItems.find(item => item.id === li.id);

  if (editButton.textContent === "Edit") {
    const input = document.createElement('input');
    input.className = "edit-input";
    input.type = "text";
    input.value = todo.task;

    taskSpan.replaceWith(input);
    editButton.textContent = "Save";
  } else {
    const input = li.querySelector('.edit-input');
    const newText = input.value.trim();

    const newSpan = document.createElement('span');
    newSpan.className = 'task-text';
    newSpan.textContent = newText;

    input.replaceWith(newSpan);

    // Update the task in todoItems
    todoItems = todoItems.map(item =>
      item.id === li.id ? { ...item, task: newText } : item
    );

    addTodos(todoItems);
    editButton.textContent = "Edit";
  }
};

// Apply filter and render todos
/**
 * Applies the selected filter to the todo list and updates the UI accordingly.
 *
 * @param {string} filter - "all", "active", or "completed"
 */
function applyFilter(filter) {
  currentFilter = filter;
  localStorage.setItem("currentFilter", filter);
  ul.innerHTML = "";

  let filtered = [];
  if (filter === "all") {
    filtered = todoItems;
  } else if (filter === "active") {
    filtered = todoItems.filter(todo => !todo.completed);
  } else if (filter === "completed") {
    filtered = todoItems.filter(todo => todo.completed);
  }

  filtered.forEach((curTodo) => {
    const li = document.createElement('li');
    li.className = "list";
    li.setAttribute('id', curTodo.id);

    // ✅ Wrap task text in a span
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = curTodo.task;

    li.appendChild(taskSpan);
    renderButtons(li);
    ul.appendChild(li);
  });

  taskCounter();
}

// Task counter display
function taskCounter() {
  countdisplay.textContent = ul.children.length;
}

// Clear all tasks
function clearTasks() {
  ul.innerHTML = "";
  todoItems = [];
  localStorage.setItem("todos", JSON.stringify([]));
  taskCounter();
}
clearAllBtn.addEventListener("click", clearTasks);

// Filter button events
document.getElementById("filter-all").addEventListener("click", (e) => {
  e.preventDefault();
  applyFilter("all");
});

document.getElementById("filter-active").addEventListener("click", (e) => {
  e.preventDefault();
  applyFilter("active");
});

document.getElementById("filter-completed").addEventListener("click", (e) => {
  e.preventDefault();
  applyFilter("completed");
});
document.getElementById("filter-dropdown").addEventListener("change", function (e) {
  applyFilter(e.target.value);
});


// Load tasks on page load
init();
