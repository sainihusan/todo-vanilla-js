function addTodo(task) {
  let todos = localStorage.getItem("todos");

  if (todos) {
    todos += "||" + task; // use "||" as separator
  } else {
    todos = task;
  }

  localStorage.setItem("todos", todos);
}

function getTodos() {
  let todos = localStorage.getItem("todos");
  return todos ? todos.split("||") : [];
}
