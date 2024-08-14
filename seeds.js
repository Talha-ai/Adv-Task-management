const mongoose = require('mongoose');
const Task = require('./models/task');
const moment = require('moment');


mongoose.connect('mongodb://127.0.0.1:27017/taskList')
  .then(() => {
    console.log('MONGO CONNECTION OPEN');
  })
  .catch(err => {
    console.log('ERROR!!');
    console.log(err);
  })



// Define an array of tasks
const tasks = [
  {
    listTitle: 'Today',
    nestedTask: [
      { taskTitle: 'Dsa', description: 'Clean the house', status: 'On hold', createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"), duedate: "03-10-2023" },
      { taskTitle: 'Task 1.2', description: 'Description 1.2', status: 'In progress', createdAt: '2023-01-02', duedate: '2023-01-12' },
    ],
  },
  {
    listTitle: 'Tomorrow',
    nestedTask: [
      { taskTitle: 'Task 2.1', description: 'Description 2.1', status: 'To do', createdAt: '2023-02-01', duedate: '2023-02-10' },
      { taskTitle: 'Task 2.2', description: 'Description 2.2', status: 'In progress', createdAt: '2023-02-02', duedate: '2023-02-12' },
    ],
  },
];

// Insert the tasks into the List model
Task.insertMany(tasks)
  .then((result) => {
    console.log('Tasks inserted successfully.');
  })
  .catch((err) => {
    console.error(err);
  });

