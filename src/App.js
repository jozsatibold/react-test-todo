// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/todos";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    axios.get(API_BASE_URL).then((response) => setTodos(response.data));
  }, []);

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    axios
      .post(API_BASE_URL, {
        title: newTodo,
        completed: false,
      })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
      });
  };

  const handleToggleCompletion = (id) => {
    axios
      .patch(`${API_BASE_URL}/${id}`, { completed: !todos.find((todo) => todo.id === id).completed })
      .then((response) => {
        setTodos(
          todos.map((todo) => (todo.id === id ? { ...todo, completed: response.data.completed } : todo))
        );
      });
  };

  const handleDeleteTodo = (id) => {
    axios.delete(`${API_BASE_URL}/${id}`).then(() => {
      setTodos(todos.filter((todo) => todo.id !== id));
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Todo App</h1>
      <div className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="Add a new todo..."
          className="px-4 py-2 border rounded w-full"
        />
        <button
          onClick={handleAddTodo}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between mb-2">
            <span
              className={`cursor-pointer ${todo.completed ? "line-through" : ""}`}
              onClick={() => handleToggleCompletion(todo.id)}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;