// Get references to DOM elements
const input = document.getElementById('todo-input');
const ul = document.getElementById('todoList');
const form = document.getElementById('todo-form');
const countdisplay = document.getElementById('task-count');
const clearAllBtn = document.getElementById('clear-all-btn');

let todoItems = [];
let currentFilter = "all"; // Default filter

// Load todos from localStorage
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

// Save todos to localStorage
function addTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Generate unique IDs for tasks
function guidGenerator() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
  );
}

// Add new task
function addTask() {
  const taskText = input.value.trim();
  if (taskText.length === 0) return;

  const newTask = {
    id: guidGenerator(),
    task: taskText,
    completed: false
  };

  todoItems.push(newTask);
  addTodos(todoItems);
  input.value = '';
  applyFilter(currentFilter);
  taskCounter();
}

// Render buttons and create the list item UI for a task
function renderButtons(li) {
  const todoId = li.id;
  const todo = todoItems.find(item => item.id === todoId);

  // Checkbox for completed status
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed || false;
  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    addTodos(todoItems);
    taskCounter();
    applyFilter(currentFilter);
  });

  // Insert checkbox at the start of li
  li.insertBefore(checkbox, li.firstChild);

  // Buttons container
  const btnContainer = document.createElement('div');
  btnContainer.className = 'btn-container';

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    todoItems = todoItems.filter(item => item.id !== todo.id);
    addTodos(todoItems);
    applyFilter(currentFilter);
    taskCounter();
  });

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => handleEdit(li, todo, editBtn));

  btnContainer.appendChild(deleteBtn);
  btnContainer.appendChild(editBtn);
  li.appendChild(btnContainer);
}

// Handle editing task text
function handleEdit(li, todo, editBtn) {
  if (editBtn.textContent === 'Edit') {
    // Change to input field
    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = todo.task;
    inputEdit.className = 'edit-input';
    li.replaceChild(inputEdit, li.childNodes[1]); // Replace text node with input
    editBtn.textContent = 'Save';
  } else {
    // Save edited value
    const inputEdit = li.querySelector('.edit-input');
    const newTask = inputEdit.value.trim();
    if (newTask.length > 0) {
      todo.task = newTask;
      addTodos(todoItems);
      const textNode = document.createTextNode(todo.task);
      li.replaceChild(textNode, inputEdit);
      editBtn.textContent = 'Edit';
    } else {
      alert('Task cannot be empty.');
    }
  }
}

// Update task counter display
function taskCounter() {
  countdisplay.textContent = ul.children.length;
}

// Clear all tasks
function clearTasks() {
  todoItems = [];
  addTodos(todoItems);
  ul.innerHTML = '';
  taskCounter();
}

// Apply filter and render filtered tasks
function applyFilter(filter) {
  currentFilter = filter;
  localStorage.setItem("currentFilter", filter);
  ul.innerHTML = '';

  let filteredTasks = [];

  if (filter === 'all') {
    filteredTasks = todoItems;
  } else if (filter === 'active') {
    filteredTasks = todoItems.filter(todo => !todo.completed);
  } else if (filter === 'completed') {
    filteredTasks = todoItems.filter(todo => todo.completed);
  }

  filteredTasks.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'list';
    li.id = todo.id;
    li.appendChild(document.createTextNode(todo.task));
    ul.appendChild(li);
    renderButtons(li);
  });

  taskCounter();
}

// Event listeners for form and buttons
form.addEventListener('submit', e => {
  e.preventDefault();
  addTask();
});

clearAllBtn.addEventListener('click', clearTasks);

document.getElementById("filter-all").addEventListener('click', e => {
  e.preventDefault();
  applyFilter('all');
});

document.getElementById("filter-active").addEventListener('click', e => {
  e.preventDefault();
  applyFilter('active');
});

document.getElementById("filter-completed").addEventListener('click', e => {
  e.preventDefault();
  applyFilter('completed');
});

// Initialize on page load
window.addEventListener('load', () => {
  todoItems = getTodos();
  const savedFilter = localStorage.getItem("currentFilter") || "all";
  applyFilter(savedFilter);
});
