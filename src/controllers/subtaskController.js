const Subtask = require('../models/Subtask');
const Project = require('../models/Project');

const getSubtasks = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.userId,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const subtasks = await Subtask.find({
      projectId: req.params.projectId,
      userId: req.userId,
    }).sort({ order: 1 });

    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSubtask = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.userId,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const count = await Subtask.countDocuments({
      projectId: req.params.projectId,
    });

    const subtask = new Subtask({
      ...req.body,
      projectId: req.params.projectId,
      userId: req.userId,
      order: count,
    });

    const saved = await subtask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSubtask = async (req, res) => {
  try {
    const updated = await Subtask.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Subtask not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSubtask = async (req, res) => {
  try {
    const deleted = await Subtask.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) return res.status(404).json({ message: 'Subtask not found' });
    res.json({ message: 'Subtask deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const reorderSubtasks = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    await Promise.all(
      orderedIds.map((id, index) =>
        Subtask.findOneAndUpdate(
          { _id: id, userId: req.userId },
          { order: index }
        )
      )
    );
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const reorderProjects = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    await Promise.all(
      orderedIds.map((id, index) =>
        require('../models/Project').findOneAndUpdate(
          { _id: id, userId: req.userId },
          { order: index }
        )
      )
    );
    res.json({ message: 'Reordered' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
  reorderSubtasks,
  reorderProjects,
};