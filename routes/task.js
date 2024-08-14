const express = require('express');
const Task = require('../models/task');
const router = express.Router();
const AppError = require('../AppError');
const moment = require('moment');  //for curr time
const { isLoggedIn } = require('../middleware')

//try catch to handle mongoose errors, wrap async always in try catch
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(e => next(e));
  }
}

//Update list title
router.patch('/update-title/:id', wrapAsync(async (req, res) => {
  const taskId = req.params.id;
  const newTitle = req.body.newTitle;
  const task = await Task.findByIdAndUpdate(taskId, { listTitle: newTitle });
  if (!task) {
    throw new AppError('Task not found', 404); //cant throw cuz this async, need to send to error handling mw
  }
}));



//delete list
router
  .route('/:id')
  .delete(isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/');
  }
  ))

//delete task
router
  .route('/:id/nested/:nestedId')
  .delete(isLoggedIn, wrapAsync(async (req, res) => {
    const { id, nestedId } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { $pull: { nestedTask: { _id: nestedId } } },   // remove an element from an array
      { new: true }
    );
    if (!task) {
      throw new AppError('Task not found', 404)
    }
    res.redirect('/');
  }))
  //update task
  .patch(isLoggedIn, wrapAsync(async (req, res, next) => {

    const { id, nestedId } = req.params;
    const updatedData = req.body;

    const parentTask = await Task.findById(id);
    if (!parentTask) {
      throw new AppError('Parent task not found', 404);
    }

    const nestedTask = parentTask.nestedTask.id(nestedId);
    if (!nestedTask) {
      throw new AppError('Nested task not found', 404);
    }

    Object.assign(nestedTask, updatedData);

    await parentTask.save();
    res.redirect('/')

  }));

//create new list
router.post('/', isLoggedIn, wrapAsync(async (req, res, next) => {
  const { list_title } = req.body;
  const newList = new Task({
    listTitle: list_title,
    nestedTask: [],
    user: req.user._id
  });
  await newList.save();
  res.redirect('/');
}
))

//add new task card
router
  .route('/new-card')
  .patch(isLoggedIn, wrapAsync(async (req, res, next) => {
    const { id } = req.body;
    const newTaskDetails = req.body.cardDetails;

    const parentTask = await Task.findById(id);
    if (!parentTask) {
      throw new AppError('Parent task not found', 404);
    }
    parentTask.nestedTask.push({
      taskTitle: newTaskDetails,
      description: null,
      status: null,
      createdAt: moment().format("MMMM Do YYYY, h:mm:ss a"),
      duedate: "03-10-2023",
      user: req.user._id,
    });
    await parentTask.save();
    res.status(200);
    res.redirect('/');

  }))


module.exports = router;
