const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const db = new Database(':memory:');

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

const initialItems = [
  { name: 'Buy groceries', due_date: '2026-07-15' },
  { name: 'Call the dentist', due_date: '2026-07-20' },
  { name: 'Read a book', due_date: null },
];

const insertStmt = db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)');

initialItems.forEach(({ name, due_date }) => {
  insertStmt.run(name, due_date);
});

console.log('In-memory database initialized with sample data');

const isValidId = (id) => !isNaN(parseInt(id));
const isValidDate = (d) => d === null || /^\d{4}-\d{2}-\d{2}$/.test(d);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

app.get('/api/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', (req, res) => {
  try {
    const { name, due_date = null } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }
    if (!isValidDate(due_date)) {
      return res.status(400).json({ error: 'due_date must be in YYYY-MM-DD format' });
    }

    const result = insertStmt.run(name.trim(), due_date);
    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.put('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const { name, due_date } = req.body;

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ error: 'Item name cannot be empty' });
    }
    if (due_date !== undefined && !isValidDate(due_date)) {
      return res.status(400).json({ error: 'due_date must be in YYYY-MM-DD format' });
    }

    const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updatedName = name !== undefined ? name.trim() : existing.name;
    const updatedDueDate = due_date !== undefined ? due_date : existing.due_date;

    db.prepare('UPDATE items SET name = ?, due_date = ? WHERE id = ?').run(updatedName, updatedDueDate, id);
    const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.patch('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }

    const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare('UPDATE items SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
    const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existing = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare('DELETE FROM items WHERE id = ?').run(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = { app, db, insertStmt };