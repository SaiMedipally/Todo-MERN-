import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import './home.css';

function Home() {
    const [todos, setTodos] = useState([]);
    const [newTodoName, setNewTodoName] = useState('');
    const [newItemText, setNewItemText] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editTodoName, setEditTodoName] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        fetchTodos();
    }, [navigate]);

    const fetchTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://todo-backend-033z.onrender.com/api/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const data = await response.json();
            setTodos(data);
        } catch (err) {
            console.error('Error fetching todos:', err);
            setErrorMsg('Failed to load your todo lists');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/');
    };

    const createTodo = async (e) => {
        e.preventDefault();
        if (!newTodoName.trim()) {
            alert("Todo List name cannot be empty!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://todo-backend-033z.onrender.com/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ todoName: newTodoName })
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            const newTodo = await response.json();
            setTodos([...todos, newTodo]);
            setNewTodoName('');
        } catch (err) {
            console.error('Error creating todo:', err);
            setErrorMsg('Failed to create todo list');
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://todo-backend-033z.onrender.com/api/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
            setErrorMsg('Failed to delete todo list');
        }
    };

    const startEditTodo = (todo) => {
        setEditingTodoId(todo._id);
        setEditTodoName(todo.todoName);
    };

    const cancelEditTodo = () => {
        setEditingTodoId(null);
        setEditTodoName('');
    };

    const updateTodoName = async (id) => {
        if (!editTodoName.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://todo-backend-033z.onrender.com/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ todoName: editTodoName })
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
            setEditingTodoId(null);
        } catch (err) {
            console.error('Error updating todo:', err);
            setErrorMsg('Failed to update todo name');
        }
    };

    const addItem = async (todoId) => {
        const text = newItemText[todoId];
        if (!text || !text.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://todo-backend-033z.onrender.com/api/todos/${todoId}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ item: text })
            });

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const updatedTodo = await response.json();
            setTodos(todos.map(todo => todo._id === todoId ? updatedTodo : todo));
            setNewItemText({ ...newItemText, [todoId]: '' });
        } catch (err) {
            console.error('Error adding item:', err);
            setErrorMsg('Failed to add todo item');
        }
    };



    const toggleItemDone = async (todoId, itemId, currentDone) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://todo-backend-033z.onrender.com/api/todos/${todoId}/items/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ done: !currentDone })
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            const updatedTodo = await response.json();
            setTodos(todos.map(todo => todo._id === todoId ? updatedTodo : todo));
        } catch (err) {
            console.error('Error updating item:', err);
            setErrorMsg('Failed to update todo item');
        }
    };

    const deleteItem = async (todoId, itemId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://todo-backend-033z.onrender.com/api/todos/${todoId}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            const updatedTodo = await response.json();
            setTodos(todos.map(todo => todo._id === todoId ? updatedTodo : todo));
        } catch (err) {
            console.error('Error deleting item:', err);
            setErrorMsg('Failed to delete todo item');
        }
    };

    return (
        <div className="home-page">
            <header className="header">
                <div className="app-title">
                    <h1>Todo Application</h1>
                    <p>Organize your tasks effectively</p>
                </div>
                <div className="user-actions">
                    <span className="user-email">{localStorage.getItem('email')}</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="create-todo-section">
                <form onSubmit={createTodo} className="create-todo-form">
                    <input
                        type="text"
                        placeholder="New Todo List Name"
                        value={newTodoName}
                        onChange={(e) => setNewTodoName(e.target.value)}
                        className="todo-input"
                    />
                    <button type="submit" className="create-btn">Create Todo List</button>
                </form>
            </div>

            <div className="todos-container">
                {todos.length === 0 ? (
                    <div className="no-todos">
                        <p>You don't have any todo lists yet. Create one to get started!</p>
                    </div>
                ) : (
                    todos.map(todo => (
                        <div key={todo._id} className="todo-card">
                            <div className="todo-header">
                                {editingTodoId === todo._id ? (
                                    <div className="edit-todo-name">
                                        <input
                                            type="text"
                                            value={editTodoName}
                                            onChange={(e) => setEditTodoName(e.target.value)}
                                            className="edit-todo-input"
                                        />
                                        <div className="edit-actions">
                                            <button
                                                onClick={() => updateTodoName(todo._id)}
                                                className="save-btn"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEditTodo}
                                                className="cancel-btn"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="todo-name-container">
                                        <h2 className="todo-name">{todo.todoName}</h2>
                                        <div className="todo-actions">
                                            <button
                                                onClick={() => startEditTodo(todo)}
                                                className="edit-btn"
                                            >
                                                <FaRegEdit />
                                            </button>
                                            <button
                                                onClick={() => deleteTodo(todo._id)}
                                                className="delete-btn"
                                            >
                                                <MdOutlineDelete />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="todo-items">
                                {todo.itemsList.length === 0 ? (
                                    <p className="no-items">No items in this list yet</p>
                                ) : (
                                    <ul className="items-list">
                                        {todo.itemsList.map(item => (
                                            <li key={item._id} className={`todo-item ${item.done ? 'done' : ''}`}>
                                                <div className="item-content">
                                                    <input
                                                        type="checkbox"
                                                        id={`checkbox-${item._id}`}
                                                        checked={item.done}
                                                        onChange={() => toggleItemDone(todo._id, item._id, item.done)}
                                                        className="item-checkbox"
                                                    />
                                                    <label htmlFor={`checkbox-${item._id}`} className="item-text">
                                                        {item.text}
                                                    </label>
                                                </div>
                                                <button
                                                    onClick={() => deleteItem(todo._id, item._id)}
                                                    className="delete-item-btn"
                                                >
                                                    <MdOutlineDelete />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                )}
                            </div>

                            <div className="add-item-form">
                                <input
                                    type="text"
                                    placeholder="Add new item"
                                    value={newItemText[todo._id] || ''}
                                    onChange={(e) => setNewItemText({ ...newItemText, [todo._id]: e.target.value })}
                                    className="item-input"
                                />
                                <button
                                    onClick={() => addItem(todo._id)}
                                    className="add-item-btn"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;