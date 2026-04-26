const express = require('express');
const morgan = require('morgan');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// ─── Health & Info Routes ────────────────────────────────────────────────────
// Used by Kubernetes liveness and readiness probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

app.get('/', (req, res) => {
  res.json({
    app: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      'GET    /tasks':          'List all tasks',
      'POST   /tasks':          'Create a new task',
      'GET    /tasks/:id':      'Get a single task',
      'PUT    /tasks/:id':      'Update a task',
      'DELETE /tasks/:id':      'Delete a task',
      'GET    /health':         'Liveness probe',
      'GET    /ready':          'Readiness probe',
    }
  });
});

// ─── Task Routes ─────────────────────────────────────────────────────────────
app.use('/tasks', taskRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
