class TodoApp {
  constructor() {
    this.todoItems = [];
    this.currentFilter = "all"; // default filter
    this.input = document.getElementById('todo-input');
    this.ul = document.getElementById('todoList');
    this.button = document.getElementById('add-btn');
    this.form = document.getElementById('todo-form');
    this.countdisplay = document.getElementById('task-count');
    this.clearAllBtn = document.getElementById('clear-all-btn');
    this.errorDisplay = document.getElementById('error-display');

    this.init();
  }

  // Initialize app
  init() {
    this.todoItems = this.getTodos();
    const savedFilter = localStorage.getItem("currentFilter") || "all";
    this.applyFilter(savedFilter);
    
    // Event Listeners
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTask();
      this.taskCounter();
    });

    this.clearAllBtn.addEventListener("click", () => this.clearTasks());
    document.getElementById("filter-all").addEventListener("click", (e) => this.applyFilterHandler(e, "all"));
    document.getElementById("filter-active").addEventListener("click", (e) => this.applyFilterHandler(e, "active"));
    document.getElementById("filter-completed").addEventListener("click", (e) => this.applyFilterHandler(e, "completed"));
    document.getElementById("filter-dropdown").addEventListener("change", (e) => this.applyFilter(e.target.value));
  }

  // Get todos from localStorage
  getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
  }

  // Save todos to localStorage
  addTodos(tasks) {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }

  // Add new task
  addTask() {
    if (this.input.value.trim().length !== 0) {
      const uuid = this.guidGenerator();
      const inputValue = this.input.value.trim();
      const newTodo = { id: uuid, task: inputValue, completed: false };
      this.todoItems.push(newTodo);
      this.addTodos(this.todoItems);
      this.input.value = "";
      this.applyFilter(this.currentFilter);
    } else {
      this.errorDisplay.textContent = "Please enter a task.";
      setTimeout(() => this.errorDisplay.textContent = "", 2000);
    }
  }

  // Generate unique ID
  guidGenerator() {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  }

  // Render buttons + checkbox inside <li>
  renderButtons(li) {
    const todoId = li.id;
    const todo = this.todoItems.find(item => item.id === todoId);

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      this.addTodos(this.todoItems);
      this.applyFilter(this.currentFilter);
      this.taskCounter();
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
      this.todoItems = this.todoItems.filter(item => item.id !== todoId);
      this.addTodos(this.todoItems);
      this.taskCounter();
    });

    // Edit task
    editButton.addEventListener('click', () => this.handleEdit(li, editButton));
  }

  handleEdit(li, editButton) {
    const taskNode = li.childNodes[1]; // This is either the <span> or <input> where the task text lives
    const todoId = li.id;              // Every task <li> has a unique ID

    // Find the actual task (todo object) from the todoItems array
    let todo;
    for (let i = 0; i < this.todoItems.length; i++) {
      if (this.todoItems[i].id === todoId) {
        todo = this.todoItems[i];          // Found the task by matching IDs
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
      for (let i = 0; i < this.todoItems.length; i++) {
        if (this.todoItems[i].id === todoId) {
          this.todoItems[i].task = newValue;               // Update the text in memory
          break;
        }
      }

      this.addTodos(this.todoItems);                            // Save the updated array to localStorage
      editButton.textContent = "Edit";                // Change button text back to Edit
    }
  }

  // Apply filter and render todos
  applyFilter(filter) {
    this.currentFilter = filter;
    localStorage.setItem("currentFilter", filter);
    this.ul.innerHTML = "";

    let filtered = [];
    if (filter === "all") {
      filtered = this.todoItems;
    } else if (filter === "active") {
      filtered = this.todoItems.filter(todo => !todo.completed);
    } else if (filter === "completed") {
      filtered = this.todoItems.filter(todo => todo.completed);
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
      this.renderButtons(li);
      this.ul.appendChild(li);
    });

    this.taskCounter();
  }

  // Task counter display
  taskCounter() {
    this.countdisplay.textContent = this.ul.children.length;
  }

  // Clear all tasks
  clearTasks() {
    this.ul.innerHTML = "";
    this.todoItems = [];
    this.addTodos([]);
    this.taskCounter();
  }

  // Filter button handler
  applyFilterHandler(event, filterType) {
    event.preventDefault();
    this.applyFilter(filterType);
  }
}

// Initialize the TodoApp instance
const todoApp = new TodoApp();
