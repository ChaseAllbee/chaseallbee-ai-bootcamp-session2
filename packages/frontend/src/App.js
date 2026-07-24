import React, { useState, useEffect } from 'react';
import './App.css';

const SORT_OPTIONS = [
  { value: 'due_asc', label: 'Due Date ↑' },
  { value: 'due_desc', label: 'Due Date ↓' },
  { value: 'created_desc', label: 'Newest First' },
];

function sortItems(items, sortOrder) {
  return [...items].sort((a, b) => {
    if (sortOrder === 'due_asc' || sortOrder === 'due_desc') {
      if (!a.due_date && !b.due_date) return new Date(b.created_at) - new Date(a.created_at);
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      const cmp = a.due_date.localeCompare(b.due_date);
      return sortOrder === 'due_asc' ? cmp : -cmp;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

function isOverdue(due_date) {
  if (!due_date) return false;
  const today = new Date().toISOString().split('T')[0];
  return due_date < today;
}

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [sortOrder, setSortOrder] = useState('due_asc');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEditingId(null);
        setEditName('');
        setEditDueDate('');
        setEditError(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setItems(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), due_date: newDueDate || null }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const created = await response.json();
      setItems((prev) => [...prev, created]);
      setNewName('');
      setNewDueDate('');
      setError(null);
    } catch (err) {
      setError('Error adding task: ' + err.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDueDate(item.due_date || '');
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDueDate('');
    setEditError(null);
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      setEditError('Task name cannot be empty.');
      return;
    }
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), due_date: editDueDate || null }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      cancelEdit();
    } catch (err) {
      setEditError('Error saving: ' + err.message);
    }
  };

  const handleToggleComplete = async (item) => {
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !item.completed }),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updated = await response.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    } catch (err) {
      setError('Error updating task: ' + err.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`/api/items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      setError(null);
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  const activeItems = sortItems(items.filter((i) => !i.completed), sortOrder);
  const completedItems = items.filter((i) => i.completed);

  const renderItem = (item) => {
    const overdue = isOverdue(item.due_date);

    if (editingId === item.id) {
      return (
        <li key={item.id} className="task-row task-editing">
          <div className="task-edit-fields">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              aria-label="Edit task name"
              className="edit-name-input"
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              aria-label="Edit due date"
              className="edit-date-input"
            />
            {editError && <span className="edit-error">{editError}</span>}
          </div>
          <div className="task-actions">
            <button className="save-btn" onClick={() => handleSaveEdit(item.id)} type="button">Save</button>
            <button className="cancel-btn" onClick={cancelEdit} type="button">Cancel</button>
          </div>
        </li>
      );
    }

    return (
      <li key={item.id} className={`task-row${item.completed ? ' task-completed' : ''}`}>
        <div className="task-left">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={!!item.completed}
            onChange={() => handleToggleComplete(item)}
            aria-label={`Mark "${item.name}" as ${item.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="task-info">
            <span className="task-name">{item.name}</span>
            <span className={`task-due${overdue ? ' overdue' : ''}`}>
              {item.due_date
                ? (overdue ? `⚠ Overdue · ${item.due_date}` : item.due_date)
                : 'No due date'}
            </span>
          </div>
        </div>
        <div className="task-actions">
          {!item.completed && (
            <button className="edit-btn" onClick={() => startEdit(item)} type="button">Edit</button>
          )}
          <button className="delete-btn" onClick={() => handleDelete(item.id)} type="button">Delete</button>
        </div>
      </li>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>To Do App</h1>
        <p>Keep track of your tasks</p>
      </header>

      <main>
        <section className="add-item-section">
          <h2>Create Item</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter item name"
              aria-label="Item name"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              aria-label="Due date"
            />
            <button type="submit">Add Item</button>
          </form>
        </section>

        {error && <p className="error">{error}</p>}

        <section className="items-section">
          <div className="section-header">
            <h2>Tasks</h2>
            <div className="sort-controls" role="group" aria-label="Sort tasks">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`sort-btn${sortOrder === opt.value ? ' sort-btn-active' : ''}`}
                  onClick={() => setSortOrder(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {loading && <p>Loading data...</p>}
          {!loading && (
            <ul>
              {activeItems.length > 0 ? (
                activeItems.map(renderItem)
              ) : (
                <p className="empty-state">No active tasks. Add one above!</p>
              )}
            </ul>
          )}
        </section>

        {completedItems.length > 0 && (
          <section className="completed-section">
            <h2>Completed</h2>
            <ul>{completedItems.map(renderItem)}</ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;