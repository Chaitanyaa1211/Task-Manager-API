const { v4: uuidv4 } = require('uuid');

let tasks = [
  { id: uuidv4(), title: 'Set up Jenkins pipeline', description: 'Configure CI/CD pipeline', status: 'in-progress', priority: 'high', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Write Dockerfile', description: 'Containerize the Node.js application', status: 'done', priority: 'high', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Deploy to Kubernetes', description: 'Create Deployment, Service, and Ingress manifests', status: 'pending', priority: 'medium', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const VALID_STATUSES   = ['pending', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const findById = (id) => tasks.find((t) => t.id === id);

const TaskStore = {
  getAll(filters = {}) {
    let result = [...tasks];
    if (filters.status)   result = result.filter(t => t.status   === filters.status);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    return result;
  },
  getById(id) { return findById(id) || null; },
  create({ title, description = '', status = 'pending', priority = 'medium' }) {
    if (!title || title.trim() === '') throw new Error('Title is required');
    if (!VALID_STATUSES.includes(status))   throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    if (!VALID_PRIORITIES.includes(priority)) throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    const task = { id: uuidv4(), title: title.trim(), description: description.trim(), status, priority, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    tasks.push(task);
    return task;
  },
  update(id, updates) {
    const task = findById(id);
    if (!task) return null;
    const { title, description, status, priority } = updates;
    if (status && !VALID_STATUSES.includes(status))     throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    if (priority && !VALID_PRIORITIES.includes(priority)) throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    if (title !== undefined)       task.title       = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined)      task.status      = status;
    if (priority !== undefined)    task.priority    = priority;
    task.updatedAt = new Date().toISOString();
    return task;
  },
  delete(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
  count() {
    return {
      total:      tasks.length,
      pending:    tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done:       tasks.filter(t => t.status === 'done').length,
    };
  },
};

module.exports = TaskStore;
