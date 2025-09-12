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

// Load tasks on page load
window.addEventListener('load', () => {
  todoItems = getTodos();
  const savedFilter = localStorage.getItem("currentFilter") || "all";
  applyFilter(savedFilter);
});

// Add new task
form.addEventListener('submit', function (e) {
  e.preventDefault();
  addTask();
  taskCounter();
});

function addTask() {
  if (input.value.length !== 0) {
    const uuid = guidGenerator();
    const inputValue = input.value.trim();
    const newTodo = { id: uuid, task: inputValue, completed: false };
    todoItems.push(newTodo);
    addTodos(todoItems);
    input.value = "";
    applyFilter(currentFilter);
  }
}

// Generate unique ID
function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// Save to localStorage
const getTodos = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};
const addTodos = (task) => {
  return localStorage.setItem('todos', JSON.stringify(task));
};

// Render buttons + checkbox
const renderButtons = (li) => {
  const todoId = li.id;
  const todo = todoItems.find((item) => item.id === todoId);

  // Create checkbox
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
  const editButton = document.createElement('button');

  deleteButton.textContent = 'Delete';
  editButton.textContent = 'Edit';

  deleteButton.className = "delete-btn";
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

// Handle editing
const handleEdit = (li, editButton) => {
  let taskText;
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id === li.id) {
      taskText = todoItems[i].task;
    }
  }

  if (editButton.textContent === "Edit") {
    const input = document.createElement('input');
    input.className = "edit-input";
    input.type = "text";
    input.value = taskText;

    // Replace the text node (index 1, because checkbox is index 0)
    li.childNodes[1].replaceWith(input);
    editButton.textContent = "Save";
  } else {
    const input = li.childNodes[1];
    const newText = document.createTextNode(input.value);
    input.replaceWith(newText);

    let newArray = [];
    for (let i = 0; i < todoItems.length; i++) {
      if (todoItems[i].id === li.id) {
        newArray.push({ id: todoItems[i].id, task: input.value, completed: todoItems[i].completed });
      } else {
        newArray.push(todoItems[i]);
      }
    }
    todoItems = newArray;
    addTodos(todoItems);
    editButton.textContent = "Edit";
  }
};

// Task counter
function taskCounter() {
  countdisplay.textContent = ul.children.length;
}

// Clear all
function clearTasks() {
  ul.innerHTML = "";
  todoItems = [];
  localStorage.setItem("todos", JSON.stringify([]));
  taskCounter();
}
clearAllBtn.addEventListener("click", clearTasks);

// Apply filters
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
    li.textContent = curTodo.task;
    li.className = "list";
    li.setAttribute('id', curTodo.id);
    renderButtons(li);
    ul.appendChild(li);
  });


  taskCounter();
}

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
