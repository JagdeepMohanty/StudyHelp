import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Clock state
  const [time, setTime] = useState(new Date());

  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Todo list states
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update stopwatch when running
  useEffect(() => {
    let interval;
    if (isRunning) {
      const initialStartTime = startTime || Date.now() - stopwatchTime; // Ensure startTime is set properly
      setStartTime(initialStartTime);
      
      interval = setInterval(() => {
        setStopwatchTime(Date.now() - initialStartTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format time for clock
  const formatTime = () => {
    return time.toLocaleTimeString();
  };

  // Format stopwatch time
  const formatStopwatch = () => {
    const totalMilliseconds = stopwatchTime;
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Always show hours, even if 0, to clearly indicate capability for >1 hour
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Reset stopwatch
  const resetStopwatch = () => {
    setStopwatchTime(0);
    setIsRunning(false);
    setStartTime(null);
  };

  // Todo list handlers
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo }]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="container">
      {/* Clock */}
      <div className="clock">
        <h1>{formatTime()}</h1>
      </div>

      {/* Stopwatch */}
      <div className="stopwatch">
        <h2>{formatStopwatch()}</h2>
        <div className="controls">
          <button onClick={() => setIsRunning(true)} disabled={isRunning}>
            Start
          </button>
          <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
            Stop
          </button>
          <button onClick={resetStopwatch}>Reset</button>
        </div>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        <h3>To-Do List</h3>
        <form onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add new task"
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(todo.id)}>Save</button>
                </>
              ) : (
                <>
                  <span>{todo.text}</span>
                  <div>
                    <button onClick={() => startEditing(todo.id, todo.text)}>
                      Edit
                    </button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;