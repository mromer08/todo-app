import React, { useState } from "react";
import TodoForm from "./TodoForm";
import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiArrowDownCircleLine,
} from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Todo = ({
  todos,
  completeTodo,
  removeTodo,
  updateTodo,
  showDescription,
}) => {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return todos.map((todo, index) => (
    // <div>
    <div
      className={todo['is_done'] ? "todo-row complete" : "todo-row"}
      key={index}
    >
      <div className="description">
        <div
          key={todo.id}
          onClick={() => completeTodo(todo.id)}
          className="todo"
        >
          {todo.title}
        </div>
        <div className="icons">
          <RiCheckboxCircleLine
            onClick={() => completeTodo(todo.id)}
            className="delete-icon"
          />
          <RiArrowDownCircleLine
            onClick={() => showDescription(todo.id)}
            className="delete-icon"
          />
          <RiCloseCircleLine
            onClick={() => removeTodo(todo.id)}
            className="delete-icon"
          />
          <TiEdit
            onClick={() =>
              setEdit({
                id: todo.id,
                value: todo.title,
                description: todo.description,
                isDone: todo.isDone
              })
            }
            className="edit-icon"
          />
        </div>
      </div>
      {todo.showDescription && (
        <div onClick={() => completeTodo(todo.id)} className="description">
          <div className="text-description">📑 {todo.description}</div>
          
          <div className="dates">
            <div>Created: {timeConverter(todo['date_creation'])}</div>
            <div>Modified: {todo['date_edit'] ? timeConverter(todo['date_edit']) : 'Never'}</div>
          </div>

        </div>
      )}
    </div>
  ));
};

function timeConverter(date) {
  const utcDate = new Date(date);
  const guatemalaOffset = -6 * 60; // offset in minutes for guatemala
  const inputDate = new Date(utcDate.getTime() + guatemalaOffset * 60 * 1000);
  const currentDate = new Date();
  const seconds = Math.floor((currentDate - inputDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (seconds < 60) {
    return 'one moment ago';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (inputDate.toDateString() === currentDate.toDateString()) {
    return `today at ${inputDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (inputDate.toDateString() === new Date(currentDate.setDate(currentDate.getDate() - 1)).toDateString()) {
    return `yesterday at ${inputDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return `${inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} at ${inputDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  }
}

export default Todo;
