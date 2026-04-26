const request = require('supertest');
const app     = require('../app');

describe('Health & Info', () => {
  test('GET / returns API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.app).toBe('Task Manager API');
  });

  test('GET /health returns healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  test('GET /ready returns ready', async () => {
    const res = await request(app).get('/ready');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ready');
  });
});

describe('Tasks CRUD', () => {
  let createdTaskId;

  test('GET /tasks returns task list', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('stats');
  });

  test('POST /tasks creates a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test task', description: 'For testing', priority: 'high' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test task');
    expect(res.body.status).toBe('pending');
    createdTaskId = res.body.id;
  });

  test('POST /tasks fails without title', async () => {
    const res = await request(app).post('/tasks').send({ description: 'No title' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('POST /tasks fails with invalid status', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Bad status', status: 'unknown' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /tasks/:id returns the task', async () => {
    const res = await request(app).get(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdTaskId);
  });

  test('GET /tasks/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/tasks/non-existent-id');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /tasks/:id updates the task', async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .send({ status: 'in-progress', priority: 'low' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('in-progress');
    expect(res.body.priority).toBe('low');
  });

  test('PUT /tasks/:id returns 404 for unknown id', async () => {
    const res = await request(app)
      .put('/tasks/non-existent-id')
      .send({ status: 'done' });
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /tasks/:id deletes the task', async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted successfully');
  });

  test('DELETE /tasks/:id returns 404 after deletion', async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(404);
  });

  test('GET /tasks supports ?status= filter', async () => {
    const res = await request(app).get('/tasks?status=pending');
    expect(res.statusCode).toBe(200);
    res.body.tasks.forEach(t => expect(t.status).toBe('pending'));
  });
});
