const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCategories,
} = require('../controllers/projectController');

router.use(authenticate);

router.get('/categories', getCategories);
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;