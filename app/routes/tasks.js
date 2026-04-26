const express = require('express');
const router  = express.Router();
const store   = require('../store/taskStore');

// GET /tasks  — list all tasks (optional ?status= ?priority= filters)
router.get('/', (req, res) => {
  const { status, priority } = req.query;
  const tasks = store.getAll({ status, priority });
  res.json({
    count: tasks.length,
    stats: store.count(),
    tasks,
  });
});

// GET /tasks/:id  — get single task
router.get('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /tasks  — create task
router.post('/', (req, res) => {
  try {
    const task = store.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /tasks/:id  — update task
router.put('/:id', (req, res) => {
  try {
    const task = store.update(req.params.id, req.body);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id  — delete task
router.delete('/:id', (req, res) => {
  const deleted = store.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
