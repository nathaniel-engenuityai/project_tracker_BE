const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes');
const subtaskController = require('./controllers/subtaskController');
const authenticate = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.put('/api/projects/reorder', authenticate, subtaskController.reorderProjects);
app.use('/api/projects/:projectId/subtasks', subtaskRoutes);

app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT || 8080}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));