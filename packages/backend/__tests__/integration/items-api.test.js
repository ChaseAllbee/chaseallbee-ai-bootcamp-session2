const request = require('supertest');
const { app, db } = require('../../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createItem = async (name = 'Temp Item', due_date = null) => {
  const response = await request(app)
    .post('/api/items')
    .send({ name, due_date })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /api/items', () => {
    it('should return all items with full schema', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('due_date');
      expect(item).toHaveProperty('completed');
      expect(item).toHaveProperty('created_at');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item without a due date', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Test Item' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Item');
      expect(response.body.due_date).toBeNull();
      expect(response.body.completed).toBe(0);
    });

    it('should create a new item with a due date', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Task with date', due_date: '2026-08-01' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.due_date).toBe('2026-08-01');
    });

    it('should return 400 for an invalid due_date format', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Bad date', due_date: 'not-a-date' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update the name of an item', async () => {
      const item = await createItem('Original Name');
      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('should update the due date of an item', async () => {
      const item = await createItem('Date Task', '2026-08-01');
      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ due_date: '2026-09-01' });

      expect(response.status).toBe(200);
      expect(response.body.due_date).toBe('2026-09-01');
    });

    it('should return 400 if updated name is empty', async () => {
      const item = await createItem('Has Name');
      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: '' });

      expect(response.status).toBe(400);
    });

    it('should return 404 for a non-existent item', async () => {
      const response = await request(app).put('/api/items/999999').send({ name: 'Ghost' });
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/items/:id', () => {
    it('should mark an item as complete', async () => {
      const item = await createItem('Complete me');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(1);
    });

    it('should unmark a completed item', async () => {
      const item = await createItem('Unmark me');
      await request(app).patch(`/api/items/${item.id}`).send({ completed: true });
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ completed: false });

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(0);
    });

    it('should return 400 if completed is not a boolean', async () => {
      const item = await createItem('Bad patch');
      const response = await request(app)
        .patch(`/api/items/${item.id}`)
        .send({ completed: 'yes' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item and return 204', async () => {
      const item = await createItem('Item To Be Deleted');

      const deleteResponse = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteResponse.status).toBe(204);

      const deleteAgain = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteAgain.status).toBe(404);
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app).delete('/api/items/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Item not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/items/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid item ID is required');
    });
  });
});