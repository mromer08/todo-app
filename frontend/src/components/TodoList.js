import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    const respuesta = await fetch('http://localhost:3001/v1/to-dos');
    const resJson = await respuesta.json();
    setTodos(resJson.todos);
    console.log(todos)
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = async (todo) => {
    console.log('estoy agregando un nuevo todo')
    const respuesta = await fetch("http://localhost:3001/v1/to-do", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getTodos();
    console.log(await respuesta.json());
  };

  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const updateTodo = async (todoId, newValue) => {
    console.log(newValue);
    console.log('esta fue el valor a actualizar xd ' + todoId);
    const respuesta = await fetch(`http://localhost:3001/v1/to-do/${todoId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: newValue.title, description: newValue.description }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getTodos();
    console.log(await respuesta.json());
  };

  const removeTodo = async (id) => {
    const respuesta = await fetch(`http://localhost:3001/v1/to-do/${id}`, {
      method: "DELETE",
    });
    getTodos();
    console.log(await respuesta.json());
  };

  const completeTodo = async (id) => {
    const todo = await fetch(`http://localhost:3001/v1/to-do/${id}`);
    const todoJson = await todo.json();
    const isDone = todoJson.todo['is_done'] === 1 ? 0 : 1;
    const respuesta = await fetch(`http://localhost:3001/v1/to-do/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ 'is_done': isDone }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    getTodos();
    console.log(await respuesta.json());
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm
      onSubmit={addTodo}
      // onSubmitChange={updateTodo}
      />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
