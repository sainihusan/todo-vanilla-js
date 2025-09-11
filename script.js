const input = document.getElementById('todo-input');
const ul= document.getElementById('todoList');
const button = document.getElementById('add-btn');
const form = document.getElementById('todo-form');
const countSpan = document.getElementById('task-count');
let todoListValue = [];


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
   

    deleteButton.addEventListener('click',() => {
    li.remove();
    updateCount();
    
    
  });
editButton.addEventListener('click', () => {
  let liValue;
    for(let i=0; i<todoListValue.length; i++){
        if(todoListValue[i] === li.id){
          liValue = todoListValue[i]
        }
      }

    if (editButton.textContent == "Edit") {
      console.log(liValue, li.id)
      const addText = li.firstChild.textContent;
      const input = document.createElement('input');
      input.className = "edit-input"
      input.type = "text";
      input.value = liValue;



      li.firstChild.replaceWith  (input);
      editButton.textContent = "Save";
    } else {
      
      const input = li.firstChild;
      const newText = document.createTextNode(input.value);

      input.replaceWith(newText);
      let newArray = []
      for(let i=0; i<todoListValue.length; i++){
        if(todoListValue[i] === liValue){
          newArray.push(input.value)
        } else{

          newArray.push(todoListValue[i])
        }
      }

      addToDOLocalStorage(newArray)
      
      editButton.textContent = "Edit";
     
     
    }
  });
};



form.addEventListener('submit', function(e) {
  e.preventDefault()
  addTask()
  updateCount()
})


const getToDoLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todos"))|| [];
}
const addToDOLocalStorage = (task) =>{
  return localStorage.setItem('todos', JSON.stringify(task))
}


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
  
    
  });

};
let TaskId = 0;

function addTask(){
  if(input.value.length !== 0){
    const inputValue = input.value.trim();
    todoListValue.push(inputValue);
    const li = document.createElement('li');
    TaskId++;
    li.setAttribute('id',`task-${TaskId}`);
    li.textContent = inputValue;
    li.setAttribute('id', inputValue)
    li.className = "list"
    ul.appendChild(li);
    renderButtons(li);
    input.value=""
    addToDOLocalStorage(todoListValue)
  }
}
  

function updateCount() {
  countSpan.textContent = ul.children.length;
}

showTodoList();









