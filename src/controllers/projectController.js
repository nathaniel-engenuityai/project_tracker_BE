const Project = require('../models/Project');

const getAllProjects = async (req, res) => {
  try {
    const {
      search,
      category,
      priority,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 6,
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = { $regex: category, $options: 'i' };
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const sortOrder = order === 'asc' ? 1 : -1;
    const validSortFields = ['createdAt', 'name', 'priority', 'estimatedMinutes', 'loggedMinutes'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      projects,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Project.distinct('category', { category: { $ne: '' } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCategories,
};