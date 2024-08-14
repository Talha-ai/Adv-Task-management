const mongoose = require('mongoose');
const Task = require('./task');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username cannot be empty'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email cannot be empty'],
    unique: true
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
});

userSchema.pre('remove', async function (next) {
  try {
    await Task.deleteMany({ user: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

// // .populate('users')
// // .then(user => console.log(user));

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);


// const makeTasks = async () => {
//   const user = new User({ username: 'Farooq', password: '32483290482' });
// const user = await User.findOne({ username: 'Talha' })
//   const task3 = new Task({
//     listTitle: 'Future',
//   });
//   task3.user = user;
//   user.save();
//   task3.save();
// };

// makeTasks();


// const findTask = async () => {
//   const task = await Task.find({}).populate('users');
//   console.log(task);
// }

// findTask();

module.exports = User;