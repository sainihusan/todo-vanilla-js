const input = document.getElementById('todo-input');
const ul= document.getElementById('todoList');
const button = document.getElementById('add-btn');
const form = document.getElementById('todo-form');

form.addEventListener('submit', function(e) {
  e.preventDefault()
  addTask()
})


function addTask(){
  const inputValue = input.value;
  const li = document.createElement('li');
  li.textContent = inputValue;
  ul.appendChild(li);
  input.value=""
}

