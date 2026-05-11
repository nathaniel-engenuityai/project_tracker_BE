const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    estimatedHours: {
      type: Number,
      required: true,
    },
    loggedHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['not started', 'in progress', 'completed'],
      default: 'not started',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);