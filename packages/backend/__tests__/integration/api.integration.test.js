const request = require('supertest');
const { app, db } = require('../../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('API Integration Tests', () => {
  describe('Items CRUD workflow', () => {
    it('should create and then retrieve an item', async () => {
      const createResponse = await request(app)
        .post('/api/items')
        .send({ name: 'Integration Test Item' })
        .set('Accept', 'application/json');

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty('id');
      expect(createResponse.body.name).toBe('Integration Test Item');

      const getResponse = await request(app).get('/api/items');
      expect(getResponse.status).toBe(200);
      const found = getResponse.body.find(item => item.id === createResponse.body.id);
      expect(found).toBeDefined();
      expect(found.name).toBe('Integration Test Item');
    });

    it('should create, retrieve, and delete an item', async () => {
      const createResponse = await request(app)
        .post('/api/items')
        .send({ name: 'Item To Delete' })
        .set('Accept', 'application/json');

      expect(createResponse.status).toBe(201);
      const itemId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/api/items/${itemId}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'Item deleted successfully');

      const getResponse = await request(app).get('/api/items');
      expect(getResponse.status).toBe(200);
      const found = getResponse.body.find(item => item.id === itemId);
      expect(found).toBeUndefined();
    });

    it('should return all items from the database', async () => {
      const response = await request(app).get('/api/items');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Health check', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});
