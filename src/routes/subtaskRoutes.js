const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticate = require('../middleware/auth');
const {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  reorderSubtasks,
  reorderProjects,
} = require('../controllers/subtaskController');

router.use(authenticate);

router.get('/', getSubtasks);
router.post('/', createSubtask);
router.put('/reorder', reorderSubtasks);
router.put('/:id', updateSubtask);
router.delete('/:id', deleteSubtask);

module.exports = router;