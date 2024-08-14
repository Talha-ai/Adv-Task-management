const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: [true, 'Task title cannot be empty']
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['To do', 'In progress', 'On hold', 'Done'],
    default: 'To do',
  },
  createdAt: {
    type: String,
    default: Date.now,
  },
  duedate: {
    type: String,
    default: Date.now,
  },
});

const listSchema = new mongoose.Schema({
  listTitle: {
    type: String,
    required: [true, 'List title cannot be empty']
  },
  nestedTask: [taskSchema],
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }]
});


const Task = mongoose.model('List', listSchema);

module.exports = Task;