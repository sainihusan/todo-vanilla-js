const input = document.getElementById('todo-input');
const ul= document.getElementById('todoList');
const button = document.getElementById('add-btn');
const form = document.getElementById('todo-form');
const countdisplay = document.getElementById('task-count');
const clearAllBtn = document.getElementById('clear-all-btn');
const errorDisplay = document.getElementById('error-display')

let todoItems = [];


form.addEventListener('submit', function(e) {
  e.preventDefault()
  addTask()
  taskCounter()
})

// function to add new task 
function addTask(){
  if(input.value.length !== 0){

    const uuid = guidGenerator()
    const inputValue = input.value.trim();
    const newTodo = {id: uuid, task: inputValue}
    todoItems.push(newTodo);

    const li = document.createElement('li');
    li.setAttribute('id', newTodo.id);
    li.textContent = inputValue;
    li.className = "list"
    ul.appendChild(li);
    renderButtons(li);
    input.value=""
    addTodos(todoItems)
  }
  else{

  }
}

// task ids
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


  // saving to localstorage
  const getTodos = () => {
    return JSON.parse(localStorage.getItem("todos"))|| [];
}
  const addTodos = (task) =>{
     return localStorage.setItem('todos', JSON.stringify(task))
}


// showtodolist
const showTodoList =() => {
  todoItems=getTodos();
  todoItems.forEach((curTodo) => {
    
    const li = document.createElement('li');
  li.textContent = curTodo.task;
  
  li.className = "list"
  li.setAttribute('id', curTodo.id)
  ul.appendChild(li);
  renderButtons(li);
  input.value=""

  taskCounter();
  });
};


// renderbuttons

const renderButtons = (li) => {
    const div = document.createElement('div')
    div.className = "btn-container"
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');
    deleteButton.textContent  = 'Delete'
    editButton.textContent  = 'Edit'
    deleteButton.className = "delete-btn"
    editButton.className = "edit-btn" 
    div.appendChild(deleteButton)
    div.appendChild(editButton)
    li.appendChild(div)

   
// deletebutton
    deleteButton.addEventListener('click',() => {
    li.remove();
    taskCounter();    
  });
  editButton.addEventListener('click', () => handleEdit(li, editButton)); 
};

// handling edit
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
        li.firstChild.replaceWith(input);
        editButton.textContent = "Save";
    } else {
        
        const input = li.firstChild;
        const newText = document.createTextNode(input.value);
        input.replaceWith(newText);

        
        let newArray = [];
        for (let i = 0; i < todoItems.length; i++) {
            if (todoItems[i].id === li.id) {
                newArray.push({ id: todoItems[i].id, task: input.value });
            } else {
                newArray.push(todoItems[i]);
            }
        }
        addTodos(newArray);
        editButton.textContent = "Edit";
    }
};

  
// taskcounter
function taskCounter() {
  countdisplay.textContent = ul.children.length;
}


// cleartasks
function clearTasks() {
  ul.innerHTML = "";

  todoItems = [];

  localStorage.setItem("todos", JSON.stringify([]));

  taskCounter();
}
clearAllBtn.addEventListener("click", clearTasks);



const showTodoList =() => {
  todoListValue=getToDoLocalStorage();
  todoListValue.forEach((curTodo) => {
    
    const li = document.createElement('li');
  li.textContent = curTodo;
  
  li.className = "list"
  li.setAttribute('id', curTodo)
  ul.appendChild(li);
  renderButtons(li);
  input.value=""
  updateCount();
  
    
  });


showTodoList();


function showError(text) {
  // errorDisplay.classList.remove('hide')
  // errorDisplay.classList.add('show')
  errorDisplay.style.visibility = 'visible'
}



 










