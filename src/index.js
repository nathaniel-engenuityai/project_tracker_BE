import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
require('dotenv').config();

import projectRoutes from './routes/projectRoutes';
import uploadRoutes from './routes/uploadRoutes';

import subtaskRoutes from './routes/subtaskRoutes';
import subtaskController from './controllers/subtaskController';
import authenticate from './middleware/auth';

const app = express();

app.use(cors());
app.use(json());

app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/projects/:projectId/subtasks', subtaskRoutes);
app.put('/api/projects/reorder', authenticate, subtaskController.reorderProjects);

connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));