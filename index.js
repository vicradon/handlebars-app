const express = require("express");
const { v4: uuid } = require("uuid");
const { engine } = require("express-handlebars");

const app = express();
const PORT = 4000;

app.use(express.json());

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home");
});

const sampleTodo = {
  id: uuid(),
  task: "Some task to be done",
  is_done: false,
  created_at: Date.now(),
  updated_at: Date.now(),
};

// makeshift database
let todos = [sampleTodo];

// Fetches data
app.get("/todos", function (req, res) {
  res.status(200).send({
    data: todos,
    message: "Todos fetched successfully",
  });
});

// Creates data, or does modification on backend
app.post("/todos", function (req, res) {
  const { task } = req.body;

  if (!task) {
    res.status(400).json({
      message: "No task was set",
    });
  }

  const todo = {
    id: uuid(),
    task,
    is_done: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  todos.push(todo);
  res.status(200).json({
    data: todo,
    message: "Successfully created todo",
  });

  res.send(task);
});

// Update data on server
app.patch("/todos/:id", function (req, res) {
  const { id } = req.params;
  const { task, is_done } = req.body;

  const targetTodo = todos.find((todo) => todo.id == id);
  const targetTodoIndex = todos.findIndex((todo) => todo.id == id);

  todos[targetTodoIndex] = {
    ...targetTodo,
    task,
    is_done,
    updated_at: Date.now(),
  };

  res.status(200).json({
    data: todos[targetTodoIndex],
    message: "Successfully updated todo",
  });
});

// Delete data on server
app.delete("/todos/:id", function (req, res) {
  const { id } = req.params;

  const targetTodo = todos.find((todo) => todo.id === id);
  const todosWithoutTarget = todos.filter((todo) => todo.id !== id);
  todos = todosWithoutTarget;

  res.status(200).json({
    data: targetTodo,
    message: "Successfully deleted todo",
  });
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
