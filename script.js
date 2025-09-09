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
renderButtons(li)
//   deleteTask(li)
//   editTask(li)
}

const renderButtons = (li) => {
    const div = document.createElement('div')
    const deleteButton = document.createElement('button');
    const editButton = document.createElement('button');
    deleteButton.textContent  = 'Delete'
    editButton.textContent  = 'Edit'
    div.appendChild(deleteButton)
    div.appendChild(editButton)
    li.appendChild(div)
}

// function deleteTask(li){
//     const deleteBtn = document.createElement('Button');
//     deleteBtn.textContent = "Delete"
//     deleteBtn.className = "delete-btn";
//     li.appendChild(deleteBtn);
//     deleteBtn.onclick = function(){
//         li.remove();

//     }
    
// }

// function editTask(li) {
//   const editBtn = document.createElement('button');
//   editBtn.textContent = "Edit";
//   editBtn.className = "edit-btn";
//   li.appendChild(editBtn);

//   editBtn.onclick = function () {
//     const span = li.firstChild; 
//     const input = document.createElement('input');
//     input.type = "text";
//     input.value = span.textContent;

//    li.insertBefore(input, span);
//     li.removeChild(span);
//     editBtn.textContent = "Save";

//     // Save click
//     editBtn.onclick = function () {
//       const newSpan = document.createElement('span');
//       newSpan.textContent = input.value;
//       li.insertBefore(newSpan, input);
//       li.removeChild(input);
//       editBtn.textContent = "Edit";

//       // Restore original edit behavior
//       editBtn.onclick = editBtnOriginalClick;
//     };
//   };

//   // Store original click handler to restore later
//    editBtnOriginalClick = editBtn.onclick;
  
// }







