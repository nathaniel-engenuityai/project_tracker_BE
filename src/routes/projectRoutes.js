const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCategories,
} = require('../controllers/projectController');

router.get('/categories', getCategories);
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);