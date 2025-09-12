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

const handleEdit = (li, editButton) => {
  const taskNode = li.childNodes[1]; // This is either the <span> or <input> where the task text lives
  const todoId = li.id;              // Every task <li> has a unique ID

  // Find the actual task (todo object) from the todoItems array
  let todo;
  for (let i = 0; i < todoItems.length; i++) {
    if (todoItems[i].id === todoId) {
      todo = todoItems[i];          // Found the task by matching IDs
      break;
    }
  }

  // CASE 1: The task is shown as text inside a <span>
  if (taskNode.tagName === "SPAN") {
    const input = document.createElement("input");  // Create an input box
    input.type = "text";
    input.className = "edit-input";                 // Apply class for styling
    input.value = todo.task;                        // Fill it with the existing task

    li.replaceChild(input, taskNode);               // Replace the <span> with <input>
    editButton.textContent = "Save";                // Change button text to Save
  }
  // CASE 2: The task is currently in an <input> and we want to save it
  else if (taskNode.tagName === "INPUT") {
    const newValue = taskNode.value.trim();         // Get updated value from input

    const span = document.createElement("span");    // Create a new <span> to show text again
    span.className = "task-text";
    span.textContent = newValue;

    li.replaceChild(span, taskNode);                // Replace <input> with <span>

    // Update the corresponding todo item in the array
    for (let i = 0; i < todoItems.length; i++) {
      if (todoItems[i].id === todoId) {
        todoItems[i].task = newValue;               // Update the text in memory
        break;
      }
    }

    addTodos(todoItems);                            // Save the updated array to localStorage
    editButton.textContent = "Edit";                // Change button text back to Edit
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
