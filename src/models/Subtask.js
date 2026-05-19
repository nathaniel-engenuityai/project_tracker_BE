const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    estimatedMinutes: {
      type: Number,
      required: true,
    },
    loggedMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['not started', 'in progress', 'completed'],
      default: 'not started',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subtask', subtaskSchema);