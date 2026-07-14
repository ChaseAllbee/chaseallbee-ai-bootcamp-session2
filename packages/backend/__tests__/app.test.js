const Database = require('better-sqlite3');

// Each unit test run gets its own isolated in-memory database
let db;

beforeEach(() => {
  db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  ['Item 1', 'Item 2', 'Item 3'].forEach(name => {
    db.prepare('INSERT INTO items (name) VALUES (?)').run(name);
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

  it('should have id, name, and created_at columns', () => {
    const columns = db.prepare('PRAGMA table_info(items)').all();
    const colNames = columns.map(c => c.name);
    expect(colNames).toContain('id');
    expect(colNames).toContain('name');
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
});

describe('Item CRUD operations', () => {
  it('should insert a new item and return its id', () => {
    const result = db.prepare('INSERT INTO items (name) VALUES (?)').run('New Item');
    expect(result.lastInsertRowid).toBeTruthy();
  });

  it('should retrieve an inserted item by id', () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO items (name) VALUES (?)').run('Find Me');
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid);
    expect(item.name).toBe('Find Me');
    expect(item).toHaveProperty('created_at');
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