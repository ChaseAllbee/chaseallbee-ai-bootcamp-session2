const Database = require('better-sqlite3');

// Each unit test run gets its own isolated in-memory database
let db;

beforeEach(() => {
  db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      due_date TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  [
    { name: 'Item 1', due_date: '2026-07-15' },
    { name: 'Item 2', due_date: null },
    { name: 'Item 3', due_date: '2026-07-20' },
  ].forEach(({ name, due_date }) => {
    db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)').run(name, due_date);
  });
});

afterEach(() => {
  db.close();
});

describe('Database schema', () => {
  it('should have the items table', () => {
    const table = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='items'")
      .get();
    expect(table).toBeDefined();
    expect(table.name).toBe('items');
  });

  it('should have id, name, due_date, completed, and created_at columns', () => {
    const columns = db.prepare('PRAGMA table_info(items)').all();
    const colNames = columns.map(c => c.name);
    expect(colNames).toContain('id');
    expect(colNames).toContain('name');
    expect(colNames).toContain('due_date');
    expect(colNames).toContain('completed');
    expect(colNames).toContain('created_at');
  });
});

describe('Database seeding', () => {
  it('should seed 3 initial items', () => {
    const items = db.prepare('SELECT * FROM items').all();
    expect(items).toHaveLength(3);
  });

  it('should seed items with the correct names', () => {
    const items = db.prepare('SELECT name FROM items ORDER BY id').all();
    expect(items.map(i => i.name)).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('should seed items with completed defaulting to 0', () => {
    const items = db.prepare('SELECT completed FROM items').all();
    items.forEach(item => expect(item.completed).toBe(0));
  });
});

describe('Item CRUD operations', () => {
  it('should insert a new item and return its id', () => {
    const result = db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)').run('New Item', null);
    expect(result.lastInsertRowid).toBeTruthy();
  });

  it('should retrieve an inserted item by id with all fields', () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)').run('Find Me', '2026-08-01');
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid);
    expect(item.name).toBe('Find Me');
    expect(item.due_date).toBe('2026-08-01');
    expect(item.completed).toBe(0);
    expect(item).toHaveProperty('created_at');
  });

  it('should update completed flag', () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)').run('Toggle Me', null);
    db.prepare('UPDATE items SET completed = 1 WHERE id = ?').run(lastInsertRowid);
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid);
    expect(item.completed).toBe(1);
  });

  it('should delete an item by id', () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO items (name) VALUES (?)').run('Delete Me');
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(lastInsertRowid);
    expect(result.changes).toBe(1);
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid);
    expect(item).toBeUndefined();
  });

  it('should return 0 changes when deleting a non-existent item', () => {
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(999999);
    expect(result.changes).toBe(0);
  });
});