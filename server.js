const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const FILE_PATH = path.join(__dirname, 'tasks.json');

app.use(cors());
app.use(bodyParser.json());

// Load tasks from JSON file
function loadTasks() {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
}

// Save tasks to JSON file
function saveTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

// API Routes
app.get('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = {
    id: Date.now(),
    title: req.body.title,
    status: 'pending'
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.status = task.status === 'pending' ? 'done' : 'pending';
  saveTasks(tasks);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
